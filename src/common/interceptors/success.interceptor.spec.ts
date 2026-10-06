import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './success.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformInterceptor],
    }).compile();

    interceptor = module.get<TransformInterceptor<any>>(TransformInterceptor);
  });

  const createMockContext = (request: any = {}): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as ExecutionContext;

  const createMockCallHandler = (data: any): CallHandler =>
    ({
      handle: () => of(data),
    }) as CallHandler;

  describe('intercept - basic data transformation', () => {
    it('should transform normal data to success response', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler({ name: 'test', value: 123 });

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result).toEqual({
          success: true,
          data: { name: 'test', value: 123 },
          errorCode: '',
          errorMessage: '',
          showType: 0,
          traceId: '',
          host: '',
        });
        done();
      });
    });

    it('should return null data correctly', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler(null);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.success).toBe(true);
        expect(result.data).toBeNull();
        done();
      });
    });

    it('should handle undefined data', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler(undefined);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.success).toBe(true);
        expect(result.data).toBeUndefined();
        done();
      });
    });
  });

  describe('intercept - already formatted response', () => {
    it('should return data if already has success field', (done) => {
      const context = createMockContext();
      const alreadyFormatted = {
        success: true,
        data: { id: 1 },
        errorCode: 'CUSTOM_CODE',
        errorMessage: 'Custom message',
      };
      const callHandler = createMockCallHandler(alreadyFormatted);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result).toBe(alreadyFormatted);
        done();
      });
    });

    it('should return data with success: false if already formatted', (done) => {
      const context = createMockContext();
      const alreadyFormatted = {
        success: false,
        data: null,
        errorCode: 'ERROR_CODE',
        errorMessage: 'Error message',
      };
      const callHandler = createMockCallHandler(alreadyFormatted);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result).toBe(alreadyFormatted);
        done();
      });
    });
  });

  describe('intercept - pagination handling', () => {
    it('should format pagination data correctly', (done) => {
      const context = createMockContext();
      const paginatedData = {
        list: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
        total: 100,
        current: 1,
        pageSize: 10,
      };
      const callHandler = createMockCallHandler(paginatedData);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result).toEqual({
          success: true,
          data: {
            list: paginatedData.list,
            total: 100,
            current: 1,
            pageSize: 10,
          },
          errorCode: '',
          errorMessage: '',
          showType: 0,
          traceId: '',
          host: '',
        });
        done();
      });
    });

    it('should handle pagination with missing total', (done) => {
      const context = createMockContext();
      const paginatedData = {
        list: [{ id: 1 }],
      };
      const callHandler = createMockCallHandler(paginatedData);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.data.total).toBe(0);
        done();
      });
    });

    it('should handle pagination with missing current', (done) => {
      const context = createMockContext();
      const paginatedData = {
        list: [{ id: 1 }],
      };
      const callHandler = createMockCallHandler(paginatedData);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.data.current).toBe(1);
        done();
      });
    });

    it('should handle pagination with missing pageSize', (done) => {
      const context = createMockContext();
      const paginatedData = {
        list: [{ id: 1 }],
      };
      const callHandler = createMockCallHandler(paginatedData);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.data.pageSize).toBe(10);
        done();
      });
    });

    it('should handle empty list', (done) => {
      const context = createMockContext();
      const paginatedData = {
        list: [],
        total: 0,
      };
      const callHandler = createMockCallHandler(paginatedData);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.data.list).toEqual([]);
        expect(result.data.total).toBe(0);
        done();
      });
    });

    it('should handle pagination with extra fields', (done) => {
      const context = createMockContext();
      const paginatedData = {
        list: [{ id: 1 }],
        total: 50,
        current: 2,
        pageSize: 20,
        extra: 'should be preserved',
      };
      const callHandler = createMockCallHandler(paginatedData);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.data.list).toEqual([{ id: 1 }]);
        expect(result.data.total).toBe(50);
        expect(result.data.current).toBe(2);
        expect(result.data.pageSize).toBe(20);
        done();
      });
    });
  });

  describe('intercept - response structure', () => {
    it('should have correct success field', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler({ data: 'test' });

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.success).toBe(true);
        done();
      });
    });

    it('should have empty errorCode and errorMessage', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler({ data: 'test' });

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.errorCode).toBe('');
        expect(result.errorMessage).toBe('');
        done();
      });
    });

    it('should have showType as 0', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler({ data: 'test' });

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.showType).toBe(0);
        done();
      });
    });

    it('should have empty traceId and host', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler({ data: 'test' });

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.traceId).toBe('');
        expect(result.host).toBe('');
        done();
      });
    });
  });

  describe('intercept - edge cases', () => {
    it('should handle string data', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler('string data');

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.data).toBe('string data');
        done();
      });
    });

    it('should handle number data', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler(42);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.data).toBe(42);
        done();
      });
    });

    it('should handle array data', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler([1, 2, 3]);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.data).toEqual([1, 2, 3]);
        done();
      });
    });

    it('should handle boolean data', (done) => {
      const context = createMockContext();
      const callHandler = createMockCallHandler(true);

      interceptor.intercept(context, callHandler).subscribe((result) => {
        expect(result.data).toBe(true);
        done();
      });
    });
  });
});
