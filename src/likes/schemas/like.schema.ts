import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

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
}

export const LikeSchema = SchemaFactory.createForClass(Like);
