import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class BanUserForBlog {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  banReason: string;

  @IsNotEmpty()
  @IsMongoId()
  blogId: string;
}
