import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../repository/comments.query.repository';
import { CustomResponse } from '../../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../../utils/customResponse/CustomResponseEnum';
import { LikeInputDto } from '../../likes/dto/LikeInputDto';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { CommentsService } from '../application/public/comments.service';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional.jwt.guard';
import { CommentDto } from '../dto/CommentDto';
import { Exceptions } from '../../utils/throwException';
import { UsersQueryRepository } from '../../users/repositories/users.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentUseCaseCommand } from '../application/public/use-cases/update-comment-use-case';
import { DeleteCommentUseCaseCommand } from '../application/public/use-cases/delete-comment-use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getComment(@Param('id') id: string, @CurrentUser() user) {
    const currentUserId = user?.id || null;
    const comment = await this.commentQueryRepository.getCommentById(
      id,
      currentUserId,
    );
    if (!comment) Exceptions.throwHttpException(CustomResponseEnum.notExist);
    const isCommentOwnerBanned = await this.usersQueryRepository.isUserBanned(
      comment.commentatorInfo.userId,
    );
    if (isCommentOwnerBanned)
      Exceptions.throwHttpException(CustomResponseEnum.notExist);

    return comment;
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateComment(
    @Body() dto: CommentDto,
    @Param('id') id: string,
    @CurrentUser() user,
  ) {
    const isUpdated: CustomResponse<any> = await this.commandBus.execute(
      new UpdateCommentUseCaseCommand(dto, id, user.id),
    );

    if (!isUpdated.isSuccess)
      Exceptions.throwHttpException(isUpdated.errStatusCode);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteComment(@Param('id') id: string, @CurrentUser() user) {
    const deletingResult = await this.commandBus.execute(
      new DeleteCommentUseCaseCommand(id, user.id),
    );

    if (!deletingResult.isSuccess)
      Exceptions.throwHttpException(deletingResult.errStatusCode);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async setLike(
    @Param('id') id: string,
    @Body() dto: LikeInputDto,
    @CurrentUser() user: { id: string; userName: string },
  ) {
    const isLikeSet = await this.commentsService.setLikeStatus(
      dto.likeStatus,
      id,
      user.id,
      user.userName,
    );

    if (!isLikeSet) Exceptions.throwHttpException(CustomResponseEnum.notExist);

    return;
  }
}
