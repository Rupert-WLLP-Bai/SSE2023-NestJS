import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * @file 结构化日志服务
 * @description 基于 NestJS Logger 的增强版日志服务，支持 JSON 格式输出
 * @author SSE Team
 */

/**
 * 日志服务选项
 */
export interface LoggerOptions {
  /**
   * 服务名称/上下文
   */
  context?: string;
}

/**
 * 结构化日志数据
 */
interface LogData {
  /**
   * 时间戳
   */
  timestamp: string;
  /**
   * 日志级别
   */
  level: string;
  /**
   * 上下文/模块名
   */
  context: string;
  /**
   * 消息
   */
  message: string;
  /**
   * 请求追踪ID
   */
  traceId?: string;
  /**
   * 其他数据
   */
  [key: string]: unknown;
}

/**
 * 结构化日志服务
 *
 * @example
 * // 在模块中使用
 * constructor(private readonly logger: LoggerService) {}
 *
 * // 记录日志
 * this.logger.info('User logged in', { userId: 123 });
 * this.logger.error('Failed to process request', { error: err });
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly context: string;

  constructor(options: LoggerOptions = {}) {
    const { context = 'App' } = options;
    this.context = context;
  }

  /**
   * 生成 traceId
   */
  private getTraceId(): string {
    return uuidv4();
  }

  /**
   * 格式化日志为 JSON 字符串
   */
  private formatLog(level: string, message: string, meta?: Record<string, unknown>): string {
    const logData: LogData = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      traceId: this.getTraceId(),
      ...meta,
    };
    return JSON.stringify(logData);
  }

  /**
   * 解析日志 JSON 字符串为对象
   */
  private parseLog(jsonStr: string): LogData {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return {
        timestamp: new Date().toISOString(),
        level: 'info',
        context: this.context,
        message: jsonStr,
        traceId: this.getTraceId(),
      };
    }
  }

  /**
   * 记录日志的通用方法
   */
  private logMessage(
    level: string,
    message: string,
    context?: string,
    meta?: Record<string, unknown>,
  ): void {
    const jsonStr = this.formatLog(level, message, meta);

    // 根据级别使用不同的 console 方法
    switch (level) {
      case 'error':
      case 'fatal':
        console.error(jsonStr);
        break;
      case 'warn':
        console.warn(jsonStr);
        break;
      default:
        console.log(jsonStr);
    }
  }

  /**
   * 实现 NestJS LoggerService 的 log 方法
   */
  log(message: string, context?: string): void {
    this.logMessage('info', message, context);
  }

  /**
   * 记录 error 级别日志
   */
  error(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logMessage('error', message, context, meta);
  }

  /**
   * 记录 warn 级别日志
   */
  warn(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logMessage('warn', message, context, meta);
  }

  /**
   * 记录 info 级别日志
   */
  info(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logMessage('info', message, context, meta);
  }

  /**
   * 记录 debug 级别日志
   */
  debug(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logMessage('debug', message, context, meta);
  }

  /**
   * 记录 verbose 级别日志
   */
  verbose(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logMessage('verbose', message, context, meta);
  }

  /**
   * 记录 HTTP 请求日志
   */
  logHttp(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    requestId?: string,
    meta?: Record<string, unknown>,
  ): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    this.logMessage(
      level,
      `${method} ${url} ${statusCode} ${responseTime}ms`,
      'HTTP',
      {
        method,
        url,
        statusCode,
        responseTime,
        traceId: requestId || this.getTraceId(),
        ...meta,
      },
    );
  }

  /**
   * 创建子日志实例（带上下文）
   */
  child(bindings: Record<string, unknown>): LoggerService {
    const context = bindings.context as string || this.context;
    return new LoggerService({ context });
  }
}

/**
 * 创建日志服务的工厂函数
 *
 * @param context 模块/服务名称
 * @returns LoggerService 实例
 *
 * @example
 * const logger = createLogger('UserService');
 * logger.info('User created', { userId: 123 });
 */
export function createLogger(context: string): LoggerService {
  return new LoggerService({ context });
}
