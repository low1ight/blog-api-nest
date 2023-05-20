import { CommentsRepository } from './repository/comments.repository';
import { Injectable } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { LikesService } from '../likes/likes.service';
@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
  ) {}

  async createComment(
    content: string,
    postId: string,
    commentatorId: string,
    commentatorName: string,
  ) {
    const isPostExist = await this.postsService.checkIsPostExistById(postId);

    if (!isPostExist) return null;

    const comment = await this.commentsRepository.createComment({
      content,
      postId,
      commentatorId,
      commentatorName,
    });

    //save comment and return saved comment id
    return await this.commentsRepository.save(comment);
  }

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
