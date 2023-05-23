import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModel,
} from '../schemas/comment.schema';
import { CreateCommentDto } from '../dto/CreateCommentDto';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
@Injectable()
export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: CommentModel) {}

  async createComment(dto: CreateCommentDto) {
    return await this.commentModel.createComment(dto, this.commentModel);
  }

  async getCommentById(id: string) {
    if (!mongoose.isValidObjectId(id)) return null;
    return this.commentModel.findById(id);
  }

  async save(comment: CommentDocument) {
    const savedComment: CommentDocument = await comment.save();
    return savedComment._id.toString();
  }

  async deleteComment(id: string) {
    const result = await this.commentModel.deleteOne({ _id: id });

    return result.deletedCount === 1;
  }

  async isCommentExist(id: string) {
    if (!mongoose.isValidObjectId(id)) return null;
    return this.commentModel.exists({ _id: id });
  }
}
