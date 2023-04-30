import { Injectable } from '@nestjs/common';
import { PostsRepository } from './repository/posts.repository';
import { CreatePostInputDto } from './dto/CreatePostInputDto';
import { BlogsRepository } from '../blogs/repository/blogs.repository';

import { CreatePostDto } from './dto/CreatePostDto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly blogRepository: BlogsRepository,
  ) {}
  async createPost(createPostInputData: CreatePostInputDto) {
    //in blog exist, get blog name
    const blogName = await this.blogRepository.getBlogNameById(
      createPostInputData.blogId,
    );

    if (!blogName) return null;

    //create correct dto with blog name
    const createPostDto: CreatePostDto = {
      ...createPostInputData,
      blogName: blogName,
    };

    return await this.postRepository.createPost(createPostDto);
  }
}
