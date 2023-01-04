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
export interface Response {
  success: boolean;
  data?: any;
  errorCode?: string;
  errorMessage?: string;
  showType?: number;
  traceId?: string;
  host?: string;
}

export interface UpdateResponse {
  success: boolean;
  data?: UpdateResult;
  errorCode?: string;
  errorMessage?: string;
  showType?: number;
  traceId?: string;
  host?: string;
}

export interface DeleteResponse {
  success: boolean;
  data?: DeleteResult;
  errorCode?: string;
  errorMessage?: string;
  showType?: number;
  traceId?: string;
  host?: string;
}

export interface CreateResponse {
  success: boolean;
  data?: any;
  errorCode?: string;
  errorMessage?: string;
  showType?: number;
  traceId?: string;
  host?: string;
}

export interface QueryResponse {
  success: boolean;
  data: QueryResult;
  errorCode?: string;
  errorMessage?: string;
  showType?: number;
  traceId?: string;
  host?: string;
}
