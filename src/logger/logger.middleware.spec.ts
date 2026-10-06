import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    middleware = new LoggerMiddleware();

    mockNext = jest.fn();

    mockReq = {
      method: 'GET',
      originalUrl: '/api/test',
      body: { name: 'test', age: 20 },
      files: [{ filename: 'file1.txt' }, { filename: 'file2.txt' }],
    };

    mockRes = {
      statusCode: 200,
    };
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should call next function when next is provided', () => {
      middleware.use(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should not throw when next is not provided', () => {
      expect(() => {
        middleware.use(mockReq, mockRes, undefined as any);
      }).not.toThrow();
    });

    it('should not throw when next is null', () => {
      expect(() => {
        middleware.use(mockReq, mockRes, null as any);
      }).not.toThrow();
    });

    it('should access req.method for logging', () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      methods.forEach((method) => {
        mockReq.method = method;
        expect(() => {
          middleware.use(mockReq, mockRes, mockNext);
        }).not.toThrow();
      });
    });

    it('should access req.originalUrl for logging', () => {
      mockReq.originalUrl = '/api/v1/test';
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should access res.statusCode for logging', () => {
      const statusCodes = [200, 201, 400, 401, 404, 500];
      statusCodes.forEach((statusCode) => {
        mockRes.statusCode = statusCode;
        expect(() => {
          middleware.use(mockReq, mockRes, mockNext);
        }).not.toThrow();
      });
    });

    it('should handle object body', () => {
      mockReq.body = { key: 'value', nested: { data: 123 } };
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle array body', () => {
      mockReq.body = [1, 2, 3, 4];
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle string body', () => {
      mockReq.body = 'plain text body';
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle number body', () => {
      mockReq.body = 12345;
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle null body', () => {
      mockReq.body = null;
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle undefined body', () => {
      mockReq.body = undefined;
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle object files', () => {
      mockReq.files = [{ name: 'file1.txt' }, { name: 'file2.pdf' }];
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle empty files array', () => {
      mockReq.files = [];
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle null files', () => {
      mockReq.files = null;
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle undefined files', () => {
      mockReq.files = undefined;
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle single file', () => {
      mockReq.files = { name: 'single.txt' };
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should log all properties correctly for typical request', () => {
      mockReq.method = 'POST';
      mockReq.originalUrl = '/api/experiments';
      mockReq.body = { title: 'New Experiment', courseId: 1 };
      mockReq.files = [{ originalname: 'report.pdf' }];
      mockRes.statusCode = 201;

      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();

      expect(mockNext).toHaveBeenCalled();
    });

    it('should work with query parameters in URL', () => {
      mockReq.originalUrl = '/api/test?page=1&limit=10';
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should work with nested route', () => {
      mockReq.originalUrl = '/api/courses/1/experiments';
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle empty object body', () => {
      mockReq.body = {};
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    it('should handle deeply nested body', () => {
      mockReq.body = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      };
      expect(() => {
        middleware.use(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });
  });
});
