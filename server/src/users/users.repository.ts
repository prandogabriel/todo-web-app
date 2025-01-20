import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  private readonly tableName = 'todo-app';
  private readonly dynamoDBClient = new DynamoDBClient({
    region: 'us-east-1',
    endpoint:
      process.env.ENVIRONMENT === 'local' ? 'http://localhost:8000' : undefined,
  });

  async create(user: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: marshall(
        {
          PK: `USER#${user.id}`,
          SK: `USER#${user.id}`,
          GSI1PK: `USER#${user.email}`,
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        { convertClassInstanceToMap: true, removeUndefinedValues: true },
      ),
    };
    await this.dynamoDBClient.send(new PutItemCommand(params));
  }

  async findByEmail(email: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      IndexName: 'GSI1PK-index',
      KeyConditionExpression: 'GSI1PK = :email',
      ExpressionAttributeValues: marshall({
        ':email': `USER#${email}`,
      }),
    };
    const result = await this.dynamoDBClient.send(new QueryCommand(params));
    return result.Items ? (unmarshall(result.Items[0]) as User) : null;
  }
  async findById(id: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: marshall({
        PK: `USER#${id}`,
        SK: `USER#${id}`,
      }),
    };
    const result = await this.dynamoDBClient.send(new GetItemCommand(params));
    return result.Item ? (unmarshall(result.Item) as User) : null;
  }

  async findAll(): Promise<User[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: marshall({
        ':pk': 'USER#',
      }),
    };
    const result = await this.dynamoDBClient.send(new QueryCommand(params));
    return result.Items
      ? result.Items.map((item) => unmarshall(item) as User)
      : [];
  }

  async update(id: number, updateData: Partial<User>): Promise<void> {
    const updateExpressions: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};

    Object.keys(updateData).forEach((key) => {
      updateExpressions.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = updateData[key];
    });

    const params = {
      TableName: this.tableName,
      Key: marshall({
        PK: `USER#${id}`,
        SK: `USER#${id}`,
      }),
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
    };

    await this.dynamoDBClient.send(new UpdateItemCommand(params));
  }

  async delete(id: number): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: marshall({
        PK: `USER#${id}`,
        SK: `USER#${id}`,
      }),
    };
    await this.dynamoDBClient.send(new DeleteItemCommand(params));
  }
}
