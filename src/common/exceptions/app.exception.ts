import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes';

/**
 * @file 自定义应用异常类
 * @description 基于错误码的统一异常处理
 * @author SSE Team
 */

/**
 * 错误显示类型
 */
export enum ErrorShowType {
  /**
   * 业务错误提示 - 不显示详细堆栈信息
   */
  BUSINESS_ERROR = 1,
  /**
   * 系统错误提示 - 可能显示详细堆栈信息
   */
  SYSTEM_ERROR = 2,
  /**
   * 页面跳转错误 - 通常用于登录过期等情况
   */
  REDIRECT_ERROR = 3,
}

/**
 * AppException 构造函数选项
 */
export interface AppExceptionOptions {
  /**
   * 错误码
   */
  errorCode: ErrorCode;
  /**
   * 错误消息（可选，不提供时自动从 ErrorMessages 获取）
   */
  errorMessage?: string;
  /**
   * 错误显示类型
   */
  showType?: ErrorShowType;
  /**
   * HTTP 状态码
   */
  statusCode?: HttpStatus;
  /**
   * 额外数据
   */
  data?: any;
  /**
   * 原始错误
   */
  cause?: Error;
}

/**
 * 应用统一异常类
 *
 * @example
 * throw new AppException({
 *   errorCode: UserErrorCode.USER_NOT_FOUND,
 *   showType: ErrorShowType.BUSINESS_ERROR,
 * });
 */
export class AppException extends HttpException {
  /**
   * 错误码
   */
  public readonly errorCode: ErrorCode;

  /**
   * 错误消息
   */
  public readonly errorMessage: string;

  /**
   * 错误显示类型
   */
  public readonly showType: ErrorShowType;

  /**
   * 额外数据
   */
  public readonly data: any;

  constructor(options: AppExceptionOptions) {
    const {
      errorCode,
      errorMessage,
      showType = ErrorShowType.BUSINESS_ERROR,
      statusCode = HttpStatus.BAD_REQUEST,
      data = null,
    } = options;

    const message = errorMessage || errorCode;

    super(
      {
        success: false,
        data,
        errorCode,
        errorMessage: message,
        showType,
        traceId: '',
        host: '',
      },
      statusCode,
    );

    this.errorCode = errorCode;
    this.errorMessage = message;
    this.showType = showType;
    this.data = data;
  }

  /**
   * 创建业务错误异常
   */
  static businessError(errorCode: ErrorCode, errorMessage?: string): AppException {
    return new AppException({
      errorCode,
      errorMessage,
      showType: ErrorShowType.BUSINESS_ERROR,
    });
  }

  /**
   * 创建系统错误异常
   */
  static systemError(errorCode: ErrorCode, errorMessage?: string): AppException {
    return new AppException({
      errorCode,
      errorMessage,
      showType: ErrorShowType.SYSTEM_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  /**
   * 创建资源不存在异常
   */
  static notFound(errorCode: ErrorCode, errorMessage?: string): AppException {
    return new AppException({
      errorCode,
      errorMessage,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }

  /**
   * 创建未授权异常
   */
  static unauthorized(errorCode: ErrorCode, errorMessage?: string): AppException {
    return new AppException({
      errorCode,
      errorMessage,
      statusCode: HttpStatus.UNAUTHORIZED,
      showType: ErrorShowType.REDIRECT_ERROR,
    });
  }

  /**
   * 创建禁止访问异常
   */
  static forbidden(errorCode: ErrorCode, errorMessage?: string): AppException {
    return new AppException({
      errorCode,
      errorMessage,
      statusCode: HttpStatus.FORBIDDEN,
    });
  }

  /**
   * 获取响应对象
   */
  getResponse(): object {
    return {
      success: false,
      data: this.data,
      errorCode: this.errorCode,
      errorMessage: this.errorMessage,
      showType: this.showType,
      traceId: '',
      host: '',
    };
  }
}
