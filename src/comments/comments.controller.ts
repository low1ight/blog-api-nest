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
import { CommentsQueryRepository } from './repository/comments.query.repository';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';
import { LikeInputDto } from '../likes/dto/LikeInputDto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../common/decorators/current.user.decorator';
import { OptionalJwtAuthGuard } from '../auth/guards/optional.jwt.guard';
import { CommentDto } from './dto/CommentDto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
  ) {}

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getComment(@Param('id') id: string, @CurrentUser() user) {
    const currentUserId = user?.id || null;
    const comment = await this.commentQueryRepository.getCommentById(
      id,
      currentUserId,
    );
    if (!comment)
      CustomResponse.throwHttpException(CustomResponseEnum.notExist);
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
    const isUpdated: CustomResponse<any> =
      await this.commentsService.updateComment(dto, id, user.id);

    if (!isUpdated.isSuccess)
      CustomResponse.throwHttpException(isUpdated.errStatusCode);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteComment(@Param('id') id: string, @CurrentUser() user) {
    const deletingResult = await this.commentsService.deleteComment(
      id,
      user.id,
    );

    if (!deletingResult.isSuccess)
      CustomResponse.throwHttpException(deletingResult.errStatusCode);
  }

  @UseGuards(JwtAuthGuard)
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

    if (!isLikeSet)
      CustomResponse.throwHttpException(CustomResponseEnum.notExist);

    return;
  }
}
