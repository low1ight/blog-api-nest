import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from './repository/comments.query.repository';
import { CustomResponse } from '../utils/customResponse/CustomResponse';
import { CustomResponseEnum } from '../utils/customResponse/CustomResponseEnum';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  async getComment(@Param('id') id: string) {
    const comment = await this.commentQueryRepository.getCommentById(id);
    if (!comment)
      CustomResponse.throwHttpException(CustomResponseEnum.notExist);
    return comment;
  }
}
