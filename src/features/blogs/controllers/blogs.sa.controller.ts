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

@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}
  @Get()
  @UseGuards(BasicAuthGuard)
  async getBlogs(@Query() query: BlogInputQueryType) {
    const blogQuery = blogQueryMapper(query);

    return await this.blogsQueryRepository.getAllBlogsForSa(blogQuery);
  }

  @Put(':blogId/bind-with-user/:userId')
  @UseGuards(BasicAuthGuard)
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
  async banBlog(@Param('id') id, @Body() dto: BanBlogDto) {
    await this.commandBus.execute(new BanBlogUseCaseCommand(id, dto.isBanned));
  }
}
