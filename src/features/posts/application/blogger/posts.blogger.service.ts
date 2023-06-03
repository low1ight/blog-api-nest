import { Injectable } from '@nestjs/common';
import { CreatePostInputDto } from '../../dto/CreatePostInputDto';
import { BlogsRepository } from '../../../blogs/repository/blogs.repository';
import { UpdatePostInputDto } from '../../dto/UpdatePostInputDto';
import { CustomResponse } from '../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../utils/customResponse/CustomResponseEnum';
import { BlogDocument } from '../../../blogs/entities/blog.entity';

@Injectable()
export class PostsBloggerService {
  constructor(private readonly blogRepository: BlogsRepository) {}

  async createDto(
    dto: CreatePostInputDto | UpdatePostInputDto,
    blogId: string,
    currentUserId: string,
  ) {
    //in blog exist, get blog name

    const getBlogResult: CustomResponse<BlogDocument | null> =
      await this.getBlogAndCheckIsUserOwner(blogId, currentUserId);

    if (!getBlogResult.isSuccess) return getBlogResult;

    //create correct dto with blog name and return
    const postObj = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: getBlogResult.content.name,
    };

    return new CustomResponse(true, null, postObj);
  }

  async getBlogAndCheckIsUserOwner(
    blogId: string,
    currentUserId: string,
  ): Promise<CustomResponse<null | BlogDocument>> {
    const blog = await this.blogRepository.getBlogById(blogId);

    if (!blog)
      return new CustomResponse(false, CustomResponseEnum.notExist, null);

    if (blog.blogOwnerInfo.userId.toString() !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden, null);

    return new CustomResponse(true, null, blog);
  }
}
