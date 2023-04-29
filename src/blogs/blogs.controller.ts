import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './repository/blogs.query.repository';
import { BlogViewModel } from './types/Blog.view.model';

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

    if (!blog) throw new NotFoundException(`Blog with id ${id} not found`);

    return blog;
  }
}
