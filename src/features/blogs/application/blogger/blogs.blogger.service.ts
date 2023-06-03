import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../../repository/blogs.repository';
import { BlogDocument } from '../../entities/blog.entity';
import { CustomResponse } from '../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../utils/customResponse/CustomResponseEnum';

@Injectable()
export class BlogsBloggerService {
  constructor(protected readonly blogRepository: BlogsRepository) {}

  async getBlogAndCheckOwnership(
    blogId: string,
    currentUserId: string,
  ): Promise<CustomResponse<null | BlogDocument>> {
    const blog: BlogDocument | null = await this.blogRepository.getBlogById(
      blogId,
    );
    if (!blog) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (blog.blogOwnerInfo.userId.toString() !== currentUserId)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    return new CustomResponse(true, null, blog);
  }
}
