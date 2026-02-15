import { Module, Global, DynamicModule } from '@nestjs/common';
import { LoggerService } from './logger.service';

/**
 * @file Logger 模块
 * @description 提供结构化日志服务
 * @author SSE Team
 */

/**
 * Logger 模块选项
 */
export interface LoggerModuleOptions {
  /**
   * 默认日志上下文
   */
  context?: string;
}

/**
 * Logger 模块
 *
 * @example
 * // 全局模块（推荐）
 * LoggerModule.forRoot({ context: 'App' }),
 *
 * // 局部模块
 * LoggerModule.forFeature({ context: 'UserModule' }),
 */
@Global()
@Module({})
export class LoggerModule {
  /**
   * 初始化根模块
   */
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          useFactory: (): LoggerService => {
            return new LoggerService({
              context: options.context || 'App',
            });
          },
        },
      ],
      exports: [LoggerService],
    };
  }

  /**
   * 创建子模块（带上下文）
   */
  static forFeature(context: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          useFactory: (): LoggerService => {
            return new LoggerService({ context });
          },
        },
      ],
      exports: [LoggerService],
    };
  }
}
