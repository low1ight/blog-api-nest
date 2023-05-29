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
} from '../../public/utils/query-mappers/user-query-mapper';
import { CreateUserDto } from './dto/CreateUserDto';
import { UsersSaService } from './application/users.sa.service';
import { CustomResponseEnum } from '../../public/utils/customResponse/CustomResponseEnum';
import { BasicAuthGuard } from '../../public/auth/guards/basic.auth.guard';
import { Exceptions } from '../../public/utils/throwException';

@Controller('sa/users')
export class UsersSaController {
  constructor(
    private readonly userQueryRepository: UsersQueryRepository,
    private readonly userService: UsersSaService,
  ) {}

  @Get()
  @UseGuards(BasicAuthGuard)
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
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const isDeleted = await this.userService.deleteUser(id);

    if (!isDeleted)
      return Exceptions.throwHttpException(CustomResponseEnum.notExist);

    return;
  }
}
