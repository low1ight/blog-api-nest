import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersSaService } from '../../users/application/users.sa.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IsUserFiledAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected usersService: UsersSaService) {}

  async validate(login: any) {
    return false;
  }
}
@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserLoginAlreadyExist extends IsUserFiledAlreadyExistConstraint {
  async validate(login: any) {
    const isLoginExist = await this.usersService.isUserLoginExist(login);

    return !isLoginExist;
  }
}

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserEmailAlreadyExist extends IsUserFiledAlreadyExistConstraint {
  async validate(email: any) {
    const isEmailExist = await this.usersService.isUserEmailExist(email);

    return !isEmailExist;
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserLoginAlreadyExist,
    });
  };
}
export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserEmailAlreadyExist,
    });
  };
}
