import { IsIn, IsNotEmpty } from 'class-validator';

export class LikeInputDto {
  @IsNotEmpty()
  @IsIn(['Like', 'Dislike', 'None'])
  likeStatus: string;
}
