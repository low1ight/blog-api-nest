import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @MaxLength(15)
  name: string;

  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @MaxLength(100)
  @IsUrl()
  websiteUrl: string;
}
