import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';

@Injectable()
export class ProjectsRepository {
  private readonly tableName = 'todo-app';
  private readonly dynamoDBClient = new DynamoDBClient({
    region: 'us-east-1',
    endpoint:
      process.env.ENVIRONMENT === 'local' ? 'http://localhost:8000' : undefined,
  });

  // Create a new project
  async saveProject(project: Project): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: marshall({
        PK: `USER#${project.userId}`,
        SK: `PROJECT#${project.id}`,
        id: project.id,
        userId: project.userId,
        name: project.name,
        tasks: project.tasks ? project.tasks.map((task) => marshall(task)) : [],
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }),
    };
    await this.dynamoDBClient.send(new PutItemCommand(params));
  }

  async getProjects(userId: string): Promise<Project[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: marshall({
        ':pk': `USER#${userId}`,
        ':sk': 'PROJECT#',
      }),
    };

    const result = await this.dynamoDBClient.send(new QueryCommand(params));

    return result.Items
      ? result.Items.map((item) => {
          const project = unmarshall(item) as Project;
          if (project.tasks) {
            project.tasks = project.tasks.map((task) =>
              unmarshall(task as any),
            ) as Task[];
          }
          return project;
        })
      : [];
  }

  // Retrieve a project by ID
  async getProject(userId: string, projectId: string): Promise<Project | null> {
    const params = {
      TableName: this.tableName,
      Key: marshall({
        PK: `USER#${userId}`,
        SK: `PROJECT#${projectId}`,
      }),
    };
    const result = await this.dynamoDBClient.send(new GetItemCommand(params));
    if (!result.Item) return null;

    const project = unmarshall(result.Item) as Project;
    if (project.tasks) {
      project.tasks = project.tasks.map((task) =>
        unmarshall(task as any),
      ) as Task[];
    }
    return project;
  }

  // Add a task to a project
  async addTaskToProject(
    userId: string,
    projectId: string,
    task: Task,
  ): Promise<Project> {
    const project = await this.getProject(userId, projectId);
    if (!project) {
      throw new Error(
        `Project with ID ${projectId} not found for user ${userId}`,
      );
    }

    project.tasks.push(task);
    project.updatedAt = new Date().toISOString();

    const params = {
      TableName: this.tableName,
      Item: marshall(
        {
          PK: `USER#${userId}`,
          SK: `PROJECT#${projectId}`,
          ...project,
          tasks: project.tasks.map((t) =>
            marshall(t, {
              convertClassInstanceToMap: true,
              removeUndefinedValues: true,
            }),
          ),
        },
        { convertClassInstanceToMap: true, removeUndefinedValues: true },
      ),
    };

    await this.dynamoDBClient.send(new PutItemCommand(params));

    return project;
  }

  // Update a task within a project
  async updateTaskInProject(
    userId: string,
    projectId: string,
    taskId: string,
    updatedTaskData: Partial<Task>,
  ): Promise<void> {
    const project = await this.getProject(userId, projectId);
    if (!project) {
      throw new Error(
        `Project with ID ${projectId} not found for user ${userId}`,
      );
    }

    const taskIndex = project.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error(
        `Task with ID ${taskId} not found in project ${projectId}`,
      );
    }

    project.tasks[taskIndex] = {
      ...project.tasks[taskIndex],
      ...updatedTaskData,
      updatedAt: new Date().toISOString(),
    };

    const params = {
      TableName: this.tableName,
      Item: marshall({
        PK: `USER#${userId}`,
        SK: `PROJECT#${projectId}`,
        ...project,
        tasks: project.tasks.map((t) => marshall(t)),
      }),
    };

    await this.dynamoDBClient.send(new PutItemCommand(params));
  }

  // Delete a task from a project

  // Delete a project
  async deleteProject(userId: string, projectId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: marshall({
        PK: `USER#${userId}`,
        SK: `PROJECT#${projectId}`,
      }),
    };
    await this.dynamoDBClient.send(new DeleteItemCommand(params));
  }
}
