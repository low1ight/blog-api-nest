import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import {
  PostInputQueryType,
  postQueryMapper,
} from '../utils/query-mappers/post-query-mapper';
import { PostsQueryRepository } from './repository/posts.query.repository';
import { PostsService } from './posts.service';
import { CreatePostInputDto } from './dto/CreatePostInputDto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postQueryRepository: PostsQueryRepository,
    private readonly postService: PostsService,
  ) {}

  @Get()
  async getBlogs(@Query() query: PostInputQueryType) {
    const postQuery = postQueryMapper(query);

    return await this.postQueryRepository.getPosts(postQuery);
  }
  @Post()
  @HttpCode(201)
  async createPost(@Body() dto: CreatePostInputDto) {
    return await this.postService.createPost(dto);
  }
}
