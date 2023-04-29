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
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './repository/blogs.query.repository';
import { BlogViewModel } from './types/Blog.view.model';
import { CreateBlogDto } from './dto/CreateBlogDto';
import { UpdateBlogDto } from './dto/UpdateBlogDto';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';
import {
  BlogInputQueryType,
  blogQueryMapper,
} from '../utils/query-mappers/blog-query-mapper';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Get()
  async getBlogs(@Query() query: BlogInputQueryType) {
    const blogQuery = blogQueryMapper(query);

    return await this.blogsQueryRepository.getUsers(blogQuery);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const blog: BlogViewModel | null =
      await this.blogsQueryRepository.getUserById(id);

    if (!blog) CustomResponse.throwHttpException(CustomResponseEnum.notExist);

    return blog;
  }

  @Post()
  @HttpCode(201)
  async createBlog(@Body() dto: CreateBlogDto) {
    return await this.blogsService.createBlog(dto);
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    const result: boolean = await this.blogsService.updateBlog(dto, id);

    if (!result) CustomResponse.throwHttpException(CustomResponseEnum.notExist);

    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string) {
    const result = await this.blogsService.deleteBlog(id);

    if (!result) CustomResponse.throwHttpException(CustomResponseEnum.notExist);

    return;
  }
}
