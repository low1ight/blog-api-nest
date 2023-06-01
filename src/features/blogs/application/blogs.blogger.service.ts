import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repository/blogs.repository';
import { CreateBlogDto } from '../dto/CreateBlogDto';
import { UpdateBlogDto } from '../dto/UpdateBlogDto';
import { BlogDocument } from '../entities/blog.entity';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';
import { AuthUserData } from '../../common/types/AuthUserData';

@Injectable()
export class BlogsBloggerService {
  constructor(protected readonly blogRepository: BlogsRepository) {}

  async createBlog(
    dto: CreateBlogDto,
    authUserData: AuthUserData,
  ): Promise<string> {
    const blog = await this.blogRepository.createBlog(dto, authUserData);

    //save and return created userId
    return await this.blogRepository.save(blog);
  }

  async updateBlog(
    dto: UpdateBlogDto,
    blogId: string,
    currentUserId: string,
  ): Promise<CustomResponse<any>> {
    const blog: BlogDocument | null = await this.blogRepository.getBlogById(
      blogId,
    );
    if (!blog) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (blog._id.toString() !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    blog.updateData(dto);

    await this.blogRepository.save(blog);

    return new CustomResponse(true);
  }

  async deleteBlog(
    blogId: string,
    currentUserId: string,
  ): Promise<CustomResponse<any>> {
    const blog: BlogDocument | null = await this.blogRepository.getBlogById(
      blogId,
    );
    if (!blog) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (blog._id.toString() !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.blogRepository.deleteBlog(blogId);

    return new CustomResponse(true);
  }

  async isBlogExist(blogId: string) {
    return await this.blogRepository.isBlogExist(blogId);
  }
}
