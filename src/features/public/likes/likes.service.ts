import { Injectable } from '@nestjs/common';
import { LikeRepository } from './repository/like.repository';
import { LikeDto } from './dto/LikeDto';
import { LikeDocument } from './schemas/like.schema';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikeRepository) {}
  async setLikeStatus(dto: LikeDto, likeTargetName) {
    //get current user like for post/comment etc..
    const currentTargetLike: LikeDocument | null =
      await this.likesRepository.getCurrentTargetUserLike(
        dto.userId,
        dto.targetId,
      );

    if (
      (!currentTargetLike && dto.likeStatus === 'None') ||
      currentTargetLike?.likeStatus === dto.likeStatus
    )
      return true;
    //when like status "None" we delete like from db
    //
    if (dto.likeStatus === 'None') {
      return await this.likesRepository.deleteLikeById(currentTargetLike._id);
    }
    //when like don't exist in db we create it
    if (!currentTargetLike) {
      const like = await this.likesRepository.createLike(dto, likeTargetName);

      await this.likesRepository.save(like);

      return true;
    }
    //just edit exist like and set new status
    await currentTargetLike.setLikeStatus(dto.likeStatus);

    await this.likesRepository.save(currentTargetLike);

    return true;
  }
}
