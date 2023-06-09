import { PostsPublicService } from '../../../../posts/application/posts.public.service';
import { CommentsRepository } from '../../../repository/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../../blogs/repository/blogs.repository';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';

export class CreateCommentUseCaseCommand {
  constructor(
    public content: string,
    public postId: string,
    public commentatorId: string,
    public commentatorName: string,
  ) {}
}

@CommandHandler(CreateCommentUseCaseCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentUseCaseCommand>
{
  constructor(
    private postsService: PostsPublicService,
    private commentsRepository: CommentsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({
    content,
    postId,
    commentatorId,
    commentatorName,
  }: CreateCommentUseCaseCommand) {
    const post = await this.postsService.getPostById(postId);

    if (!post) return new CustomResponse(false, CustomResponseEnum.notExist);

    const isUserBannedForThisBlog =
      await this.blogsRepository.isUserBannedForBlog(
        post.blogId.toString(),
        commentatorId,
      );

    if (isUserBannedForThisBlog)
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    const comment = await this.commentsRepository.createComment({
      content,
      postId,
      commentatorId,
      commentatorName,
    });
    //save comment and return saved comment id
    const commentId = await this.commentsRepository.save(comment);
    return new CustomResponse(true, null, commentId);
  }
}
