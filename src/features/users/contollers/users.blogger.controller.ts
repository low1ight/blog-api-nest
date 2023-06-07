import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Exceptions } from '../../utils/throwException';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { BanUserForBlog } from '../dto/BanUserForBlog';
import { BanUserForBlogUseCaseCommand } from '../application/blogger/use-cases/ban-user-for-blog-use-case';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';
import {
  UserInputQueryType,
  userQueryMapper,
} from '../../utils/query-mappers/user-query-mapper';
import { UsersQueryRepository } from '../repositories/users.query.repository';
import { BlogsRepository } from '../../blogs/repository/blogs.repository';

@Controller('blogger/users')
export class UsersBloggerController {
  constructor(
    private commandBus: CommandBus,
    private usersQueryRepository: UsersQueryRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  @Get('blog/:id')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Query() query: UserInputQueryType, @Param('id') id) {
    const userQuery = userQueryMapper(query);

    const blog = await this.blogsRepository.getBlogById(id);

    const bannedUserList = blog?.blogBanInfo.bannedUserForThisBlog || [];

    return await this.usersQueryRepository.getUsersByArrOfId(
      userQuery,
      bannedUserList,
    );
  }

  @Put(':id/ban')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async banUserForBlog(
    @Param('id') id: string,
    @Body() dto: BanUserForBlog,
    @CurrentUser() user,
  ) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new BanUserForBlogUseCaseCommand(dto, user.id, id),
    );
    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);
  }
}
