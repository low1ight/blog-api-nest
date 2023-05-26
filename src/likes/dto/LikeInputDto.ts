import { IsIn, IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class LikeInputDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsIn(['Like', 'Dislike', 'None'])
  likeStatus: string;
}
