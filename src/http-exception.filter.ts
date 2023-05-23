import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errors: any = exception.getResponse();

      response.status(status).json({ errorMessages: errors.message });
    } else {
      const errors: any = exception.getResponse();

      response.status(status).json({ errorMessages: errors.message });
    }
  }
}
