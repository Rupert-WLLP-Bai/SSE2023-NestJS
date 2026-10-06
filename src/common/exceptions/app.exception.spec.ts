import { HttpStatus } from '@nestjs/common';
import {
  AppException,
  ErrorShowType,
  AppExceptionOptions,
} from './app.exception';
import { CommonErrorCode } from '../constants/error-codes';

describe('AppException', () => {
  describe('constructor', () => {
    it('should create an AppException with default values', () => {
      const options: AppExceptionOptions = {
        errorCode: CommonErrorCode.INVALID_PARAMETER,
      };

      const exception = new AppException(options);

      expect(exception.errorCode).toBe(CommonErrorCode.INVALID_PARAMETER);
      expect(exception.errorMessage).toBe(CommonErrorCode.INVALID_PARAMETER);
      expect(exception.showType).toBe(ErrorShowType.BUSINESS_ERROR);
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.data).toBeNull();
    });

    it('should create an AppException with custom errorMessage', () => {
      const options: AppExceptionOptions = {
        errorCode: CommonErrorCode.INVALID_PARAMETER,
        errorMessage: '自定义错误消息',
      };

      const exception = new AppException(options);

      expect(exception.errorMessage).toBe('自定义错误消息');
    });

    it('should create an AppException with custom showType', () => {
      const options: AppExceptionOptions = {
        errorCode: CommonErrorCode.INVALID_PARAMETER,
        showType: ErrorShowType.SYSTEM_ERROR,
      };

      const exception = new AppException(options);

      expect(exception.showType).toBe(ErrorShowType.SYSTEM_ERROR);
    });

    it('should create an AppException with custom statusCode', () => {
      const options: AppExceptionOptions = {
        errorCode: CommonErrorCode.INVALID_PARAMETER,
        statusCode: HttpStatus.NOT_FOUND,
      };

      const exception = new AppException(options);

      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

    it('should create an AppException with custom data', () => {
      const options: AppExceptionOptions = {
        errorCode: CommonErrorCode.INVALID_PARAMETER,
        data: { field: 'id', reason: 'invalid' },
      };

      const exception = new AppException(options);

      expect(exception.data).toEqual({ field: 'id', reason: 'invalid' });
    });
  });

  describe('static businessError', () => {
    it('should create a business error exception', () => {
      const exception = AppException.businessError(
        CommonErrorCode.INVALID_PARAMETER,
        '业务错误',
      );

      expect(exception.errorCode).toBe(CommonErrorCode.INVALID_PARAMETER);
      expect(exception.errorMessage).toBe('业务错误');
      expect(exception.showType).toBe(ErrorShowType.BUSINESS_ERROR);
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('static systemError', () => {
    it('should create a system error exception', () => {
      const exception = AppException.systemError(
        CommonErrorCode.INTERNAL_ERROR,
        '系统错误',
      );

      expect(exception.errorCode).toBe(CommonErrorCode.INTERNAL_ERROR);
      expect(exception.errorMessage).toBe('系统错误');
      expect(exception.showType).toBe(ErrorShowType.SYSTEM_ERROR);
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('static notFound', () => {
    it('should create a not found exception', () => {
      const exception = AppException.notFound(
        CommonErrorCode.NOT_FOUND,
        '资源不存在',
      );

      expect(exception.errorCode).toBe(CommonErrorCode.NOT_FOUND);
      expect(exception.errorMessage).toBe('资源不存在');
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('static unauthorized', () => {
    it('should create an unauthorized exception', () => {
      const exception = AppException.unauthorized(
        CommonErrorCode.UNAUTHORIZED,
        '未授权',
      );

      expect(exception.errorCode).toBe(CommonErrorCode.UNAUTHORIZED);
      expect(exception.errorMessage).toBe('未授权');
      expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect(exception.showType).toBe(ErrorShowType.REDIRECT_ERROR);
    });
  });

  describe('static forbidden', () => {
    it('should create a forbidden exception', () => {
      const exception = AppException.forbidden(
        CommonErrorCode.FORBIDDEN,
        '禁止访问',
      );

      expect(exception.errorCode).toBe(CommonErrorCode.FORBIDDEN);
      expect(exception.errorMessage).toBe('禁止访问');
      expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe('getResponse', () => {
    it('should return the correct response object', () => {
      const options: AppExceptionOptions = {
        errorCode: CommonErrorCode.INVALID_PARAMETER,
        errorMessage: '测试错误',
        showType: ErrorShowType.BUSINESS_ERROR,
        data: { test: 'data' },
      };

      const exception = new AppException(options);
      const response = exception.getResponse() as Record<string, any>;

      expect(response.success).toBe(false);
      expect(response.errorCode).toBe(CommonErrorCode.INVALID_PARAMETER);
      expect(response.errorMessage).toBe('测试错误');
      expect(response.showType).toBe(ErrorShowType.BUSINESS_ERROR);
      expect(response.data).toEqual({ test: 'data' });
    });
  });

  describe('ErrorShowType enum', () => {
    it('should have correct values', () => {
      expect(ErrorShowType.BUSINESS_ERROR).toBe(1);
      expect(ErrorShowType.SYSTEM_ERROR).toBe(2);
      expect(ErrorShowType.REDIRECT_ERROR).toBe(3);
    });
  });
});
