import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../repositories/users.query.repository';
import {
  UserInputQueryType,
  userQueryMapper,
} from '../../utils/query-mappers/user-query-mapper';
import { CreateUserDto } from '../dto/CreateUserDto';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';
import { BasicAuthGuard } from '../../auth/guards/basic.auth.guard';
import { Exceptions } from '../../utils/throwException';
import { BanUserDto } from '../dto/BanUserDto';
import { CommandBus } from '@nestjs/cqrs';
import { BanUserUseCaseCommand } from '../application/sa/use-case/ban-user-use-case';
import { CreateUserUseCaseCommand } from '../application/sa/use-case/create-user-use-case';
import { DeleteUserUseCaseCommand } from '../application/sa/use-case/delete-user-use-case';

@Controller('sa/users')
export class UsersSaController {
  constructor(
    private commandBus: CommandBus,
    private readonly userQueryRepository: UsersQueryRepository,
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
    return await this.commandBus.execute(new CreateUserUseCaseCommand(dto));
  }

  @Put(':id/ban')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async banUnbanUser(@Param('id') id: string, @Body() dto: BanUserDto) {
    const result: boolean = await this.commandBus.execute(
      new BanUserUseCaseCommand(id, dto),
    );
    if (!result) Exceptions.throwHttpException(CustomResponseEnum.notExist);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const isDeleted = await this.commandBus.execute(
      new DeleteUserUseCaseCommand(id),
    );

    if (!isDeleted)
      return Exceptions.throwHttpException(CustomResponseEnum.notExist);

    return;
  }
}
