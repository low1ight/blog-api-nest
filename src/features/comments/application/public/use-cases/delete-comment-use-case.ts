import { CommentDocument } from '../../../schemas/comment.schema';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { CommentsRepository } from '../../../repository/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteCommentUseCaseCommand {
  constructor(public commentId: string, public currentUserId: string) {}
}
@CommandHandler(DeleteCommentUseCaseCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentUseCaseCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ commentId, currentUserId }: DeleteCommentUseCaseCommand) {
    const comment: CommentDocument | null =
      await this.commentsRepository.getCommentById(commentId);

    if (!comment) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (!comment.isCommentOwner(currentUserId))
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    await this.commentsRepository.deleteComment(commentId);

    return new CustomResponse(true);
  }
}
