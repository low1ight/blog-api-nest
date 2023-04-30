import { CustomResponseEnum } from './CustomResponseEnum';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomResponse<T> {
  constructor(
    public readonly isSuccess: boolean,
    public readonly errStatusCode: CustomResponseEnum | null = null,
    public readonly content: T | null = null,
  ) {}

  static throwHttpException(code) {
    throw new HttpException(
      {
        status: httpStatus[code].status,
        error: httpStatus[code].message,
      },
      httpStatus[code].status,
    );
  }
}

const httpStatus = {
  1: { status: HttpStatus.NOT_FOUND, message: 'Not found' },
  2: { status: HttpStatus.BAD_REQUEST, message: 'bad request' },
  3: { status: HttpStatus.FORBIDDEN, message: 'Forbidden' },
};
