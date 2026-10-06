import { LoggerService } from './logger.service';

// Mock uuid module
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-1234'),
}));

describe('LoggerService', () => {
  let logger: LoggerService;
  let consoleSpy: {
    log: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.warn.mockRestore();
    consoleSpy.error.mockRestore();
  });

  describe('constructor', () => {
    it('should create a logger with default context', () => {
      logger = new LoggerService();
      expect(logger).toBeDefined();
    });

    it('should create a logger with custom context', () => {
      logger = new LoggerService({ context: 'TestContext' });
      expect(logger).toBeDefined();
    });
  });

  describe('log methods', () => {
    beforeEach(() => {
      logger = new LoggerService({ context: 'TestLogger' });
    });

    describe('log (info)', () => {
      it('should log info message', () => {
        logger.log('Test info message');

        expect(consoleSpy.log).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
        expect(loggedData.level).toBe('info');
        expect(loggedData.message).toBe('Test info message');
        expect(loggedData.context).toBe('TestLogger');
      });

      it('should log with custom context', () => {
        logger.log('Test message', 'CustomContext');

        expect(consoleSpy.log).toHaveBeenCalled();
      });
    });

    describe('error', () => {
      it('should log error message', () => {
        logger.error('Test error message');

        expect(consoleSpy.error).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.error.mock.calls[0][0]);
        expect(loggedData.level).toBe('error');
        expect(loggedData.message).toBe('Test error message');
      });

      it('should log error with context', () => {
        logger.error('Error message', 'ErrorContext');

        expect(consoleSpy.error).toHaveBeenCalled();
      });

      it('should log error with meta', () => {
        logger.error('Error message', 'ErrorContext', {
          userId: 123,
          action: 'login',
        });

        expect(consoleSpy.error).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.error.mock.calls[0][0]);
        expect(loggedData.userId).toBe(123);
        expect(loggedData.action).toBe('login');
      });
    });

    describe('warn', () => {
      it('should log warn message', () => {
        logger.warn('Test warn message');

        expect(consoleSpy.warn).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.warn.mock.calls[0][0]);
        expect(loggedData.level).toBe('warn');
        expect(loggedData.message).toBe('Test warn message');
      });

      it('should log warn with context', () => {
        logger.warn('Warn message', 'WarnContext');

        expect(consoleSpy.warn).toHaveBeenCalled();
      });
    });

    describe('info', () => {
      it('should log info message', () => {
        logger.info('Test info message');

        expect(consoleSpy.log).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
        expect(loggedData.level).toBe('info');
        expect(loggedData.message).toBe('Test info message');
      });

      it('should log info with context', () => {
        logger.info('Info message', 'InfoContext');

        expect(consoleSpy.log).toHaveBeenCalled();
      });

      it('should log info with meta', () => {
        logger.info('Info message', 'InfoContext', { requestId: 'abc123' });

        expect(consoleSpy.log).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
        expect(loggedData.requestId).toBe('abc123');
      });
    });

    describe('debug', () => {
      it('should log debug message', () => {
        logger.debug('Test debug message');

        expect(consoleSpy.log).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
        expect(loggedData.level).toBe('debug');
        expect(loggedData.message).toBe('Test debug message');
      });
    });

    describe('verbose', () => {
      it('should log verbose message', () => {
        logger.verbose('Test verbose message');

        expect(consoleSpy.log).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
        expect(loggedData.level).toBe('verbose');
        expect(loggedData.message).toBe('Test verbose message');
      });
    });
  });

  describe('logHttp', () => {
    beforeEach(() => {
      logger = new LoggerService({ context: 'HttpLogger' });
    });

    it('should log HTTP request with info level for 2xx', () => {
      logger.logHttp('GET', '/api/test', 200, 150);

      expect(consoleSpy.log).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(loggedData.level).toBe('info');
      expect(loggedData.method).toBe('GET');
      expect(loggedData.url).toBe('/api/test');
      expect(loggedData.statusCode).toBe(200);
      expect(loggedData.responseTime).toBe(150);
    });

    it('should log HTTP request with warn level for 4xx', () => {
      logger.logHttp('POST', '/api/test', 400, 50);

      expect(consoleSpy.warn).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleSpy.warn.mock.calls[0][0]);
      expect(loggedData.level).toBe('warn');
      expect(loggedData.statusCode).toBe(400);
    });

    it('should log HTTP request with error level for 5xx', () => {
      logger.logHttp('GET', '/api/test', 500, 500);

      expect(consoleSpy.error).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleSpy.error.mock.calls[0][0]);
      expect(loggedData.level).toBe('error');
      expect(loggedData.statusCode).toBe(500);
    });

    it('should log HTTP request with custom requestId', () => {
      logger.logHttp('GET', '/api/test', 200, 100, 'custom-request-id');

      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(loggedData.traceId).toBe('custom-request-id');
    });

    it('should log HTTP request with additional meta', () => {
      logger.logHttp('GET', '/api/test', 200, 100, undefined, { userId: 123 });

      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(loggedData.userId).toBe(123);
    });
  });

  describe('child', () => {
    beforeEach(() => {
      logger = new LoggerService({ context: 'ParentLogger' });
    });

    it('should create child logger with new context', () => {
      const childLogger = logger.child({ context: 'ChildLogger' });

      expect(childLogger).toBeInstanceOf(LoggerService);
    });

    it('should create child logger that logs with new context', () => {
      const childLogger = logger.child({ context: 'ChildLogger' });

      childLogger.info('Child log message');

      expect(consoleSpy.log).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(loggedData.context).toBe('ChildLogger');
    });

    it('should fallback to parent context if not provided', () => {
      const childLogger = logger.child({});

      childLogger.info('Child log message');

      expect(consoleSpy.log).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(loggedData.context).toBe('ParentLogger');
    });

    it('should create child logger with additional bindings', () => {
      const childLogger = logger.child({ userId: 123, context: 'ChildLogger' });

      childLogger.info('Child log message');

      expect(consoleSpy.log).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(loggedData.context).toBe('ChildLogger');
    });
  });

  describe('JSON format', () => {
    beforeEach(() => {
      logger = new LoggerService({ context: 'JsonLogger' });
    });

    it('should output valid JSON', () => {
      logger.info('Test message');

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\{.*\}$/),
      );
    });

    it('should include timestamp in JSON', () => {
      logger.info('Test message');

      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(loggedData.timestamp).toBeDefined();
      expect(new Date(loggedData.timestamp).getTime()).not.toBeNaN();
    });

    it('should include traceId in JSON', () => {
      logger.info('Test message');

      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(loggedData.traceId).toBeDefined();
      expect(typeof loggedData.traceId).toBe('string');
    });
  });
});

// Mock uuid module for createLogger tests
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-1234'),
}));

describe('createLogger', () => {
  let consoleSpy: {
    log: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.warn.mockRestore();
    consoleSpy.error.mockRestore();
  });

  it('should create logger with given context', () => {
    const { createLogger } = require('./logger.service');
    const logger = createLogger('FactoryLogger');

    expect(logger).toBeInstanceOf(LoggerService);
    logger.info('Test message');

    const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
    expect(loggedData.context).toBe('FactoryLogger');
  });
});
