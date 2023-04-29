import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './repository/blogs.query.repository';
import { BlogViewModel } from './types/Blog.view.model';
import { CreateBlogDto } from './dto/CreateBlogDto';
import { UpdateBlogDto } from './dto/UpdateBlogDto';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @Get()
  async getBlogs() {
    return await this.blogsQueryRepository.getUsers();
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
    const result: CustomResponse<null> = await this.blogsService.updateBlog(
      dto,
      id,
    );
    if (result.errStatusCode)
      CustomResponse.throwHttpException(result.errStatusCode);

    return;
  }
}
