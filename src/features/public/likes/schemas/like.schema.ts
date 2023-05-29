import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { LikeDto } from '../dto/LikeDto';

export type LikeDocument = HydratedDocument<Like>;

export interface LikeModel extends Model<LikeDocument> {
  createLike(
    dto: LikeDto,
    likeTarget: string,
    LikeModel: Model<Like>,
  ): LikeDocument;
}

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: String, required: true })
  likeTarget: string;

  @Prop({ type: Types.ObjectId, required: true })
  targetId: Types.ObjectId;

  @Prop({ type: String, required: true })
  likeStatus: string;

  @Prop({ type: String, default: false })
  userLogin: string;

  @Prop({ type: Types.ObjectId, default: false, ref: 'Users' })
  userId: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  async setLikeStatus(likeStatus: string) {
    this.likeStatus = likeStatus;
  }

  static async createLike(
    dto: LikeDto,
    likeTarget: string,
    LikeModel: Model<Like>,
  ) {
    return new LikeModel({
      likeTarget: likeTarget,
      targetId: new Types.ObjectId(dto.targetId),
      likeStatus: dto.likeStatus,
      userLogin: dto.userLogin,
      userId: new Types.ObjectId(dto.userId),
    });
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.statics = {
  createLike: Like.createLike,
};

LikeSchema.methods = {
  setLikeStatus: Like.prototype.setLikeStatus,
};
