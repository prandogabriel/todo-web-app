import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { randomUUID } from 'crypto';
import { User } from './entities/user.entity';
import { hashPassword } from '../common/hash';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    const user: User = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),

      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    };
    await this.userRepo.create(user);

    delete user.password;
    return user;
  }

  async findOneByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }
}
