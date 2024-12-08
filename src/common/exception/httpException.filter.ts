import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { HttpExceptionWithErrorCodeType } from './http-exeception-with-error-code.type';
import { ERRORS } from '@app/contracts';

@Catch(HttpExceptionWithErrorCodeType, ZodValidationException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(
    exception: HttpExceptionWithErrorCodeType | ZodValidationException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception?.getStatus();

    let errorMessage: string | string[];
    let errorCode: string = 'E000';
    let data: unknown;

    if (status === HttpStatus.FORBIDDEN) {
      errorMessage = ERRORS.FORBIDDEN_API.message;
    } else {
      errorMessage = exception.message;
      if (exception instanceof HttpExceptionWithErrorCodeType) {
        errorCode = exception.errorCode;
        data = exception.data;
      }
    }

    if (exception instanceof ZodValidationException) {
      this.logger.error(exception.getResponse());
      response.status(status).json(exception.getResponse());
    } else {
      this.logger.error({
        timestamp: new Date().toISOString(),
        path: request.url,
        message: errorMessage,
      });
      response.status(status).json({
        timestamp: new Date().toISOString(),
        path: request.url,
        message: errorMessage,
        errorCode,
        data,
      });
    }
  }
}
