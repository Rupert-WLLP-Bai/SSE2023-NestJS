import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppException } from '../exceptions/app.exception';

/**
 * @file 全局异常过滤器
 * @description 统一处理 HttpException、AppException 和未知异常，返回统一错误响应格式
 * @author Junhao Bai
 * @date 2024-01-01
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 生成 traceId
    const traceId = uuidv4();
    const timestamp = new Date().toISOString();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';
    let errorCode = 'ERR_COMMON_INTERNAL_ERROR';
    let showType = 2; // 默认为系统错误

    if (exception instanceof AppException) {
      // 处理自定义应用异常
      status = exception.getStatus();
      errorCode = exception.errorCode;
      errorMessage = exception.errorMessage;
      showType = exception.showType;

      this.logger.warn(
        `[AppException] ${errorCode}: ${errorMessage} - ${request.method} ${request.url}`,
      );
    } else if (exception instanceof HttpException) {
      // 处理 NestJS HttpException
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, any>;
        errorMessage = resp.message || exception.message;
        errorCode = resp.errorCode || `HTTP_${status}`;
        if (resp.showType !== undefined) {
          showType = resp.showType;
        }
      }

      // 如果是 401/403，不记录堆栈
      if (status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN) {
        this.logger.warn(
          `[HttpException] ${status}: ${errorMessage} - ${request.method} ${request.url}`,
        );
      } else {
        this.logger.error(
          `[HttpException] ${status}: ${errorMessage} - ${request.method} ${request.url}`,
          exception.stack,
        );
      }
    } else if (exception instanceof Error) {
      // 未知异常不泄露内部堆栈信息给客户端
      this.logger.error(
        `[Unhandled Exception] ${exception.message} - ${request.method} ${request.url}`,
        exception.stack,
      );
      errorMessage = 'Internal server error';
      errorCode = 'ERR_COMMON_INTERNAL_ERROR';
      showType = ErrorShowType.SYSTEM_ERROR;
    }

    // 5xx 错误使用系统错误显示类型
    if (status >= 500) {
      showType = ErrorShowType.SYSTEM_ERROR;
    }

    const errorResponse = {
      success: false,
      data: null,
      errorCode,
      errorMessage,
      showType,
      traceId,
      timestamp,
      path: request.url,
      method: request.method,
    };

    // 生产环境下不返回详细信息
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && showType === ErrorShowType.SYSTEM_ERROR) {
      errorResponse.errorMessage = 'Internal server error';
    }

    response.status(status).json(errorResponse);
  }
}

/**
 * 错误显示类型枚举（用于本文件）
 */
enum ErrorShowType {
  BUSINESS_ERROR = 1,
  SYSTEM_ERROR = 2,
  REDIRECT_ERROR = 3,
}
