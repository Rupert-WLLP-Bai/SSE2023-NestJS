import { ApiProperty } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { QueryResult } from './data.interface';
/**
 * @file response interface
 * @description 定义后端响应数据的接口
 * @author Junhao Bai
 * @date 2023-01-04
 * @version 1.0.0
 * @license MIT
 */
export class NormalResponse {
  @ApiProperty({ description: '请求是否成功', example: true })
  success: boolean;
  @ApiProperty({ description: '请求返回的数据', example: {} })
  data?: any;
  @ApiProperty({ description: '错误码', example: '' })
  errorCode?: string;
  @ApiProperty({ description: '错误信息', example: '' })
  errorMessage?: string;
  @ApiProperty({ description: '错误类型', example: 0 })
  showType?: number;
  @ApiProperty({ description: 'traceId', example: '' })
  traceId?: string;
  @ApiProperty({ description: 'host', example: '' })
  host?: string;
}

export class UpdateResponse {
  @ApiProperty({ description: '请求是否成功', example: true })
  success: boolean;
  @ApiProperty({
    description: '请求返回的数据',
    example: { raw: [], affected: 1, generatedMaps: [] },
  })
  data?: UpdateResult;
  @ApiProperty({ description: '错误码', example: '' })
  errorCode?: string;
  @ApiProperty({ description: '错误信息', example: '' })
  errorMessage?: string;
  @ApiProperty({ description: '错误类型', example: 0 })
  showType?: number;
  @ApiProperty({ description: 'traceId', example: '' })
  traceId?: string;
  @ApiProperty({ description: 'host', example: '' })
  host?: string;
}

export class DeleteResponse {
  @ApiProperty({ description: '请求是否成功', example: true })
  success: boolean;
  @ApiProperty({
    description: '请求返回的数据',
    example: { raw: [], affected: 1, generatedMaps: [] },
  })
  data?: DeleteResult;
  @ApiProperty({ description: '错误码', example: '' })
  errorCode?: string;
  @ApiProperty({ description: '错误信息', example: '' })
  errorMessage?: string;
  @ApiProperty({ description: '错误类型', example: 0 })
  showType?: number;
  @ApiProperty({ description: 'traceId', example: '' })
  traceId?: string;
  @ApiProperty({ description: 'host', example: '' })
  host?: string;
}

export class CreateResponse {
  @ApiProperty({ description: '请求是否成功', example: true })
  success: boolean;
  @ApiProperty({ description: '请求返回的数据', example: {} })
  data?: any;
  @ApiProperty({ description: '错误码', example: '' })
  errorCode?: string;
  @ApiProperty({ description: '错误信息', example: '' })
  errorMessage?: string;
  @ApiProperty({ description: '错误类型', example: 0 })
  showType?: number;
  @ApiProperty({ description: 'traceId', example: '' })
  traceId?: string;
  @ApiProperty({ description: 'host', example: '' })
  host?: string;
}

export class QueryResponse {
  @ApiProperty({ description: '请求是否成功', example: true })
  success: boolean;
  @ApiProperty({
    description: '请求返回的数据',
    example: {
      total: 1,
      current: 1,
      pageSize: 10,
      data: [],
    },
  })
  data: QueryResult;
  @ApiProperty({ description: '错误码', example: '' })
  errorCode?: string;
  @ApiProperty({ description: '错误信息', example: '' })
  errorMessage?: string;
  @ApiProperty({ description: '错误类型', example: 0 })
  showType?: number;
  @ApiProperty({ description: 'traceId', example: '' })
  traceId?: string;
  @ApiProperty({ description: 'host', example: '' })
  host?: string;
}
