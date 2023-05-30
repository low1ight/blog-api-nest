import { IsMongoId, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { isBlogExist } from '../../common/custromValidators/isBlogExist';

export class CreatePostInputDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(30)
  title: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(100)
  shortDescription: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(1000)
  content: string;

  @IsNotEmpty()
  @IsMongoId()
  @isBlogExist({
    message: `post can't be created for not existing blog`,
  })
  blogId: string;
}
