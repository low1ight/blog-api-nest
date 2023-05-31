import { IsNotEmpty, MaxLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

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
}
