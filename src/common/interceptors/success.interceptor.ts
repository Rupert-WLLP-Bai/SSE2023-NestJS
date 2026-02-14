import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @file 成功响应拦截器
 * @description 统一成功响应封装，支持分页结构
 * @author Junhao Bai
 * @date 2024-01-01
 */
export interface Response<T> {
  success: boolean;
  data: T;
  errorCode?: string;
  errorMessage?: string;
  showType?: number;
  traceId?: string;
  host?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // 如果返回数据已经是标准响应格式，直接返回
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // 处理分页数据结构
        let formattedData = data;
        if (
          data &&
          typeof data === 'object' &&
          'list' in data &&
          Array.isArray(data.list)
        ) {
          // 确保分页结构完整
          formattedData = {
            list: data.list,
            total: data.total ?? 0,
            current: data.current ?? 1,
            pageSize: data.pageSize ?? 10,
          };
        }

        return {
          success: true,
          data: formattedData,
          errorCode: '',
          errorMessage: '',
          showType: 0,
          traceId: '',
          host: '',
        };
      }),
    );
  }
}
