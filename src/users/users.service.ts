import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/Users.repository';
import { CreateUserDto } from './dto/CreateUserDto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto) {
    return await this.usersRepository.createUser(dto);
  }
}
