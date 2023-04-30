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
import { PostsQueryRepository } from '../posts/repository/posts.query.repository';
import {
  PostInputQueryType,
  postQueryMapper,
} from '../utils/query-mappers/post-query-mapper';
import { PostForBlogInputDto } from '../posts/dto/PostForBlogInputDto';
import { PostsService } from '../posts/posts.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
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
  //posts for blog
  @Get(':id/posts')
  async getPostsForBlog(
    @Param() id: string,
    @Query() query: PostInputQueryType,
  ) {
    const postQuery = postQueryMapper(query);
    return await this.postsQueryRepository.getPostsForBlog(postQuery, id);
  }

  @Post(':id/posts')
  @HttpCode(201)
  async createPostForBlog(
    @Body() inputData: PostForBlogInputDto,
    @Param('id') id: string,
  ) {
    return await this.postsService.createPost({ ...inputData, blogId: id });
  }
}
