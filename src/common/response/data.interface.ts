import { ApiProperty } from '@nestjs/swagger';

/**
 * @file 数据接口
 * @description 定义后端响应数据内部的数据接口
 * @author Junhao Bai
 * @date 2023-01-04
 */
export class QueryResult {
  @ApiProperty({ description: '数据列表', example: [] })
  list?: any[];
  @ApiProperty({ description: '数据总数', example: 0 })
  total?: number;
  @ApiProperty({ description: '当前页码', example: 1 })
  current?: number;
  @ApiProperty({ description: '每页数据量', example: 10 })
  pageSize?: number;
}
