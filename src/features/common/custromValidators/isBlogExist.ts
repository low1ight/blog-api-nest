import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsPublicService } from '../../blogs/application/blogs.public.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsBlogExist implements ValidatorConstraintInterface {
  constructor(protected blogsService: BlogsPublicService) {}

  async validate(blogId: any) {
    return await this.blogsService.isBlogExist(blogId);
  }
}

export function isBlogExist(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBlogExist,
    });
  };
}
