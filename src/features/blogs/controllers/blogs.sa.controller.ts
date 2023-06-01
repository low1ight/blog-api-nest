import {
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
import { BlogsSaService } from '../application/blogs.sa.service';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';

@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private readonly blogsService: BlogsSaService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
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
    const isSuccessful: boolean = await this.blogsService.bindUserToBlog(
      blogId,
      userId,
    );
    if (!isSuccessful)
      Exceptions.throwHttpException(
        CustomResponseEnum.badRequest,
        'bad request',
        'query',
      );
  }
}
