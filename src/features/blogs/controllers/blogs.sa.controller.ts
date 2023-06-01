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
import { UpdateBlogDto } from '../dto/UpdateBlogDto';
import {
  BlogInputQueryType,
  blogQueryMapper,
} from '../../utils/query-mappers/blog-query-mapper';

import { Exceptions } from '../../utils/throwException';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { BlogsBloggerService } from '../application/blogs.blogger.service';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';

import { BasicAuthGuard } from '../../auth/guards/basic.auth.guard';

@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private readonly blogsService: BlogsBloggerService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Get()
  @UseGuards(BasicAuthGuard)
  async getBlogs(@Query() query: BlogInputQueryType) {
    const blogQuery = blogQueryMapper(query);

    return await this.blogsQueryRepository.getAllBlogsForSa(blogQuery);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updateBlog(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @CurrentUser() user,
  ) {
    const result: CustomResponse<any> = await this.blogsService.updateBlog(
      dto,
      id,
      user.id,
    );

    if (!result.isSuccess) Exceptions.throwHttpException(result.errStatusCode);

    return;
  }
}
