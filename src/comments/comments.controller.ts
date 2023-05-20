import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CommentsQueryRepository } from './repository/comments.query.repository';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';
import { LikeInputDto } from '../likes/dto/LikeInputDto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../common/decorators/current.user.decorator';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentQueryRepository: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
  ) {}

  @Get(':id')
  async getComment(@Param('id') id: string) {
    const comment = await this.commentQueryRepository.getCommentById(id);
    if (!comment)
      CustomResponse.throwHttpException(CustomResponseEnum.notExist);
    return comment;
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
