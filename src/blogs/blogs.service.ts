import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './repository/blogs.repository';
import { CreateBlogDto } from './dto/CreateBlogDto';
import { UpdateBlogDto } from './dto/UpdateBlogDto';
import { BlogDocument } from './schemas/blog.schema';

@Injectable()
export class BlogsService {
  constructor(protected readonly blogRepository: BlogsRepository) {}

  async createBlog(dto: CreateBlogDto) {
    return await this.blogRepository.createBlog(dto);
  }

  async updateBlog(dto: UpdateBlogDto, blogId: string): Promise<boolean> {
    const blog: BlogDocument | null = await this.blogRepository.getBlogById(
      blogId,
    );
    if (!blog) return false;

    blog.updateData(dto);

    await this.blogRepository.save(blog);

    return true;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const blog: BlogDocument | null = await this.blogRepository.getBlogById(
      blogId,
    );
    if (!blog) return false;

    return await this.blogRepository.deleteBlog(blogId);
  }
}
