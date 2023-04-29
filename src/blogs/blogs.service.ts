import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './repository/blogs.repository';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';
import { CreateBlogDto } from './dto/CreateBlogDto';
import { UpdateBlogDto } from './dto/UpdateBlogDto';
import { BlogDocument } from './schemas/blog.schema';

@Injectable()
export class BlogsService {
  constructor(protected readonly blogRepository: BlogsRepository) {}

  async createBlog(dto: CreateBlogDto) {
    return await this.blogRepository.createBlog(dto);
  }

  async updateBlog(
    dto: UpdateBlogDto,
    blogId: string,
  ): Promise<CustomResponse<null>> {
    const blog: BlogDocument | null = await this.blogRepository.getUserById(
      blogId,
    );
    if (!blog) return new CustomResponse(CustomResponseEnum.notExist);

    blog.updateData(dto);

    await this.blogRepository.save(blog);

    return new CustomResponse(null);
  }

  async getUserById(id: string) {
    const user = await this.blogRepository.getUserById(id);
    if (!user) return new CustomResponse(CustomResponseEnum.notExist);
    return new CustomResponse(null, user);
  }
}
