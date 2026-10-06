import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppException, ErrorShowType } from '../exceptions/app.exception';
import { CommonErrorCode } from '../constants/error-codes';

// Mock uuid module
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-1234'),
}));

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockStatus: any;
  let mockJson: any;

  beforeEach(async () => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {
      method: 'GET',
      url: '/api/test',
    };
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  const createMockHost = () => ({
    switchToHttp: () => ({
      getResponse: () => mockResponse,
      getRequest: () => mockRequest,
    }),
  });

  describe('catch - AppException handling', () => {
    it('should handle AppException correctly', () => {
      const exception = new AppException({
        errorCode: CommonErrorCode.INVALID_PARAMETER,
        errorMessage: '参数错误',
        showType: ErrorShowType.BUSINESS_ERROR,
        statusCode: HttpStatus.BAD_REQUEST,
      });

      filter.catch(exception, createMockHost() as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errorCode: CommonErrorCode.INVALID_PARAMETER,
          errorMessage: '参数错误',
          showType: ErrorShowType.BUSINESS_ERROR,
        }),
      );
    });

    it('should use default errorMessage when not provided for AppException', () => {
      const exception = new AppException({
        errorCode: CommonErrorCode.INVALID_PARAMETER,
      });

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          errorMessage: CommonErrorCode.INVALID_PARAMETER,
        }),
      );
    });
  });

  describe('catch - HttpException handling', () => {
    it('should handle HttpException with string response', () => {
      const exception = new HttpException(
        'Bad Request',
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, createMockHost() as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errorMessage: 'Bad Request',
        }),
      );
    });

    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        {
          message: 'Validation failed',
          errorCode: 'VALIDATION_ERROR',
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errorMessage: 'Validation failed',
          errorCode: 'VALIDATION_ERROR',
        }),
      );
    });

    it('should handle HttpException with custom showType', () => {
      const exception = new HttpException(
        {
          message: 'Error',
          showType: ErrorShowType.BUSINESS_ERROR,
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          showType: ErrorShowType.BUSINESS_ERROR,
        }),
      );
    });

    it('should handle 401 Unauthorized correctly', () => {
      const exception = new HttpException(
        'Unauthorized',
        HttpStatus.UNAUTHORIZED,
      );

      filter.catch(exception, createMockHost() as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        }),
      );
    });

    it('should handle 403 Forbidden correctly', () => {
      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      filter.catch(exception, createMockHost() as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    });
  });

  describe('catch - Unknown Error handling', () => {
    it('should handle unknown errors correctly', () => {
      const exception = new Error('Unknown error');

      filter.catch(exception, createMockHost() as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errorCode: 'ERR_COMMON_INTERNAL_ERROR',
          errorMessage: 'Internal server error',
          showType: ErrorShowType.SYSTEM_ERROR,
        }),
      );
    });

    it('should use error message for unknown errors', () => {
      const exception = new Error('Database connection failed');

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          errorMessage: 'Internal server error',
        }),
      );
    });
  });

  describe('catch - 5xx errors', () => {
    it('should set showType to SYSTEM_ERROR for 500 status', () => {
      const exception = new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          showType: ErrorShowType.SYSTEM_ERROR,
        }),
      );
    });

    it('should set showType to SYSTEM_ERROR for 502 status', () => {
      const exception = new HttpException(
        'Bad Gateway',
        HttpStatus.BAD_GATEWAY,
      );

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          showType: ErrorShowType.SYSTEM_ERROR,
        }),
      );
    });
  });

  describe('response format', () => {
    it('should include traceId in response', () => {
      const exception = new Error('Test error');

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          traceId: expect.any(String),
        }),
      );
    });

    it('should include timestamp in response', () => {
      const exception = new Error('Test error');

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(String),
        }),
      );
    });

    it('should include path in response', () => {
      const exception = new Error('Test error');

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/test',
          method: 'GET',
        }),
      );
    });
  });

  describe('production environment', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should hide error message in production for system errors', () => {
      process.env.NODE_ENV = 'production';
      const exception = new Error('Database error');

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          errorMessage: 'Internal server error',
        }),
      );
    });

    it('should not hide error message in development for system errors', () => {
      process.env.NODE_ENV = 'development';
      const exception = new Error('Database error');

      filter.catch(exception, createMockHost() as any);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          errorMessage: 'Internal server error',
        }),
      );
    });
  });
});
