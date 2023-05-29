import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateCommentDto } from '../dto/CreateCommentDto';

export type CommentDocument = HydratedDocument<Comment>;

export interface CommentModel extends Model<CommentDocument> {
  createComment(
    dto: CreateCommentDto,
    commentModel: Model<Comment>,
  ): Promise<CommentDocument>;
}

@Schema({ _id: false })
export class CommentatorInfo {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  userLogin: string;
}

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Post' })
  postId: Types.ObjectId;

  @Prop({ type: CommentatorInfo, required: true })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: Boolean, default: false })
  isCommentOwnerBanned: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  isCommentOwner(userId: string) {
    return this.commentatorInfo.userId.toString() === userId;
  }

  updateCommentContent(newContent: string) {
    this.content = newContent;
  }

  static async createComment(
    dto: CreateCommentDto,
    commentModel: Model<Comment>,
  ) {
    return new commentModel({
      content: dto.content,
      postId: new Types.ObjectId(dto.postId),
      commentatorInfo: {
        userId: new Types.ObjectId(dto.commentatorId),
        userLogin: dto.commentatorName,
      },
    });
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.statics = {
  createComment: Comment.createComment,
};

CommentSchema.methods = {
  isCommentOwner: Comment.prototype.isCommentOwner,
  updateCommentContent: Comment.prototype.updateCommentContent,
};

CommentSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'targetId',
  options: { match: { isLikeOwnerBanned: false } },
});
