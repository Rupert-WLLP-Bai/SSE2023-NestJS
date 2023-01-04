/**
 * @file 数据接口
 * @description 定义后端响应数据内部的数据接口
 * @author Junhao Bai
 * @date 2023-01-04
 */
export interface QueryResult {
  list?: any[];
  total?: number;
  current?: number;
  pageSize?: number;
}
