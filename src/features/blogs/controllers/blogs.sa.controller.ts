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
import { BlogsQueryRepository } from '../repository/blogs.query.repository';
import {
  BlogInputQueryType,
  blogQueryMapper,
} from '../../utils/query-mappers/blog-query-mapper';

import { Exceptions } from '../../utils/throwException';

import { BasicAuthGuard } from '../../auth/guards/basic.auth.guard';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';
import { CommandBus } from '@nestjs/cqrs';
import { BindUserToBlogUseCaseCommand } from '../application/sa/use-cases/bind-user-to-blog-use-case';
import { BanBlogDto } from '../dto/BanBlogDto';
import { BanBlogUseCaseCommand } from '../application/sa/use-cases/ban-blog-use-case';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsSaController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}
  @Get()
  async getBlogs(@Query() query: BlogInputQueryType) {
    const blogQuery = blogQueryMapper(query);

    return await this.blogsQueryRepository.getAllBlogsForSa(blogQuery);
  }

  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(204)
  async updateBlog(
    @Param('blogId') blogId: string,
    @Param('userId') userId: string,
  ) {
    const isSuccessful: boolean = await this.commandBus.execute(
      new BindUserToBlogUseCaseCommand(blogId, userId),
    );
    if (!isSuccessful)
      Exceptions.throwHttpException(
        CustomResponseEnum.badRequest,
        'bad request',
        'query',
      );
  }

  @Put(':id/ban')
  @HttpCode(204)
  async banBlog(@Param('id') id, @Body() dto: BanBlogDto) {
    const result: CustomResponse<any> = await this.commandBus.execute(
      new BanBlogUseCaseCommand(id, dto.isBanned),
    );
    if (!result.isSuccess)
      return Exceptions.throwHttpException(result.errStatusCode);
  }
}
