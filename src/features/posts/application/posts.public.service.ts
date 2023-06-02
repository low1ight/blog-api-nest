import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repository/posts.repository';
import { BlogsRepository } from '../../blogs/repository/blogs.repository';
import { LikesService } from '../../likes/likes.service';

@Injectable()
export class PostsPublicService {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly blogRepository: BlogsRepository,
    private readonly likeService: LikesService,
  ) {}

  async setLikeStatus(
    likeStatus: string,
    targetId: string,
    userId: string,
    userLogin: string,
  ): Promise<boolean> {
    const isPostExist = await this.postRepository.isPostExist(targetId);
    if (!isPostExist) return false;

    await this.likeService.setLikeStatus(
      { likeStatus, targetId, userId, userLogin },
      'post',
    );

    return true;
  }

  async checkIsPostExistById(id: string) {
    return await this.postRepository.isPostExist(id);
  }
}
