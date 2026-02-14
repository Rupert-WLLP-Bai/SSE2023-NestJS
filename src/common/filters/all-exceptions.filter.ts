import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * @file 全局异常过滤器
 * @description 统一处理 HttpException 和未知异常，返回统一错误响应格式
 * @author Junhao Bai
 * @date 2024-01-01
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, any>;
        errorMessage = resp.message || exception.message;
        errorCode = resp.errorCode || `HTTP_${status}`;
      }
    } else if (exception instanceof Error) {
      // 未知异常不泄露内部堆栈信息给客户端
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
      errorMessage = 'Internal server error';
      errorCode = 'INTERNAL_ERROR';
    }

    const errorResponse = {
      success: false,
      data: null,
      errorCode,
      errorMessage,
      showType: status >= 500 ? 2 : 1, // 2: 服务端错误提示, 1: 业务错误提示
      traceId: '',
      host: '',
    };

    response.status(status).json(errorResponse);
  }
}
