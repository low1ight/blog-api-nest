import { CreatePostInputDto } from './CreatePostInputDto';
import { OmitType } from '@nestjs/mapped-types';

export class PostForBlogInputDto extends OmitType(CreatePostInputDto, [
  'blogId',
] as const) {}
