import { CommentsRepository } from './repository/comments.repository';
import { Injectable } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsService: PostsService,
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
}
