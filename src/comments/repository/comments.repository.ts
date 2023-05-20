import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModel,
} from '../schemas/comment.schema';
import { CreateCommentDto } from '../dto/CreateCommentDto';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: CommentModel) {}

  async createComment(dto: CreateCommentDto) {
    return await this.commentModel.createComment(dto, this.commentModel);
  }

  async save(comment: CommentDocument) {
    const savedComment: CommentDocument = await comment.save();
    return savedComment._id.toString();
  }
}
