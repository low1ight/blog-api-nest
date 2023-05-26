import { PartialType } from '@nestjs/mapped-types';
import { CreatePostInputDto } from './CreatePostInputDto';

export class UpdatePostInputDto extends PartialType(CreatePostInputDto) {}
