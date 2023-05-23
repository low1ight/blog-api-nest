import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from './repository/users.query.repository';
import {
  UserInputQueryType,
  userQueryMapper,
} from '../utils/query-mappers/user-query-mapper';
import { CreateUserDto } from './dto/CreateUserDto';
import { UsersService } from './users.service';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';

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
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const isDeleted = await this.userService.deleteUser(id);

    if (!isDeleted)
      return CustomResponse.throwHttpException(CustomResponseEnum.notExist);

    return;
  }
}
