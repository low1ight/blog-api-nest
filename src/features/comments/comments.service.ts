import { CommentsRepository } from './repository/comments.repository';
import { Injectable } from '@nestjs/common';
import { PostsPublicService } from '../posts/application/posts.public.service';
import { LikesService } from '../likes/likes.service';
import { CommentDto } from './dto/CommentDto';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';
import { CommentDocument } from './schemas/comment.schema';
@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsService: PostsPublicService,
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

  async deleteComment(commentId: string, currentUserId: string) {
    const comment: CommentDocument | null =
      await this.commentsRepository.getCommentById(commentId);

    if (!comment) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (!comment.isCommentOwner(currentUserId))
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.commentsRepository.deleteComment(commentId);

    return new CustomResponse(true);
  }

  async updateComment(
    dto: CommentDto,
    commentId: string,
    currentUserId: string,
  ) {
    const comment: CommentDocument | null =
      await this.commentsRepository.getCommentById(commentId);

    if (!comment) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (!comment.isCommentOwner(currentUserId))
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    comment.updateCommentContent(dto.content);

    await this.commentsRepository.save(comment);

    return new CustomResponse(true);
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
