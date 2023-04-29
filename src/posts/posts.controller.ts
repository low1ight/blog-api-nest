import { Controller, Get, Query } from '@nestjs/common';
import {
  PostInputQueryType,
  postQueryMapper,
} from '../utils/query-mappers/post-query-mapper';
import { PostQueryRepository } from './repository/post.query.repository';

@Controller('posts')
export class PostsController {
  constructor(private readonly postQueryRepository: PostQueryRepository) {}

  @Get()
  async getBlogs(@Query() query: PostInputQueryType) {
    const postQuery = postQueryMapper(query);

    return await this.postQueryRepository.getPosts(postQuery);
  }
}
