import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument, LikeModel } from '../schemas/like.schema';
import { LikeDto } from '../dto/LikeDto';
import { Types } from 'mongoose';

@Injectable()
export class LikeRepository {
  constructor(@InjectModel(Like.name) private likeModel: LikeModel) {}

  async createLike(dto: LikeDto, likeTarget: string) {
    return this.likeModel.createLike(dto, likeTarget, this.likeModel);
  }

  async getCurrentTargetUserLike(userId, targetId) {
    return this.likeModel.findOne({
      userId: new Types.ObjectId(userId),
      targetId: new Types.ObjectId(targetId),
    });
  }

  async deleteLikeById(id) {
    const result = await this.likeModel.deleteOne({ _id: id });

    return result.deletedCount === 1;
  }

  async save(like: LikeDocument) {
    await like.save();
  }
}
