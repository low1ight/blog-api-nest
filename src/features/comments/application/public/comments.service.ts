import { CommentsRepository } from '../../repository/comments.repository';
import { Injectable } from '@nestjs/common';
import { PostsPublicService } from '../../../posts/application/posts.public.service';
import { LikesService } from '../../../likes/likes.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsService: PostsPublicService,
    private readonly likesService: LikesService,
  ) {}

  async setLikeStatus(
    likeStatus: string,
    targetId: string,
    userId: string,
    userLogin: string,
  ): Promise<boolean> {
    const isCommentExist = await this.commentsRepository.isCommentExist(
      targetId,
    );
    if (!isCommentExist) return false;

    await this.likesService.setLikeStatus(
      { likeStatus, targetId, userId, userLogin },
      'comment',
    );

    return true;
  }
}
