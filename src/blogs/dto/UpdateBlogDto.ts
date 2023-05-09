import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './CreateBlogDto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
