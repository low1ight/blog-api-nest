import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { UsersQueryRepository } from './repository/users.query.repository';
import {
  UserInputQueryType,
  userQueryMapper,
} from '../utils/query-mappers/user-query-mapper';
import { CreateUserDto } from './dto/CreateUserDto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userQueryRepository: UsersQueryRepository,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async getUsers(@Query() query: UserInputQueryType) {
    const userQuery = userQueryMapper(query);

    return await this.userQueryRepository.getUsers(userQuery);
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }
}
