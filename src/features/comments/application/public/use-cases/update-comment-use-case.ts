import { CommentDto } from '../../../dto/CommentDto';
import { CommentDocument } from '../../../schemas/comment.schema';
import { CustomResponse } from '../../../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../../../utils/customResponse/CustomResponseEnum';
import { CommentsRepository } from '../../../repository/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateCommentUseCaseCommand {
  constructor(
    public dto: CommentDto,
    public commentId: string,
    public currentUserId: string,
  ) {}
}
@CommandHandler(UpdateCommentUseCaseCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentUseCaseCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    dto,
    commentId,
    currentUserId,
  }: UpdateCommentUseCaseCommand) {
    const comment: CommentDocument | null =
      await this.commentsRepository.getCommentById(commentId);

    if (!comment) return new CustomResponse(false, CustomResponseEnum.notExist);

    if (!comment.isCommentOwner(currentUserId))
      return new CustomResponse(false, CustomResponseEnum.forbidden);

    comment.updateCommentContent(dto.content);

    await this.commentsRepository.save(comment);

    return new CustomResponse(true);
  }
}
