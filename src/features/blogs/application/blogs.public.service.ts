import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repository/blogs.repository';

@Injectable()
export class BlogsPublicService {
  constructor(protected readonly blogRepository: BlogsRepository) {}

  async isBlogExist(blogId: string) {
    return await this.blogRepository.isBlogExist(blogId);
  }
}
