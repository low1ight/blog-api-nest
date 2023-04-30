import { Controller, Get, Query } from '@nestjs/common';
import { UsersQueryRepository } from './repository/users.query.repository';
import {
  UserInputQueryType,
  userQueryMapper,
} from '../utils/query-mappers/user-query-mapper';

@Controller('users')
export class UsersController {
  constructor(private readonly userQueryRepository: UsersQueryRepository) {}

  @Get()
  async getUsers(@Query() query: UserInputQueryType) {
    const userQuery = userQueryMapper(query);

    return await this.userQueryRepository.getUsers(userQuery);
  }
}
