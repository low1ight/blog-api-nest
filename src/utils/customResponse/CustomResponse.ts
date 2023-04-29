import { CustomResponseEnum } from './CustomResponseEnum';

export class CustomResponse<T> {
  constructor(
    public readonly errStatusCode: CustomResponseEnum | null,
    public readonly content: T | null = null,
  ) {}
}
