import {
  DeleteResponse,
  NormalResponse,
  QueryResponse,
  UpdateResponse,
} from './response.interface';

const emptyMeta = {
  errorCode: '',
  errorMessage: '',
  showType: 0,
  traceId: '',
  host: '',
};

export function ok<T>(data: T): NormalResponse {
  return {
    success: true,
    data,
    ...emptyMeta,
  };
}

export function fail(
  errorCode: string,
  errorMessage: string,
  showType = 1,
  data: unknown = null,
): NormalResponse {
  return {
    success: false,
    data,
    errorCode,
    errorMessage,
    showType,
    traceId: '',
    host: '',
  };
}

export function okQuery(
  list: unknown[],
  total?: number,
  current = 1,
  pageSize = 10,
): QueryResponse {
  return {
    success: true,
    data: {
      list,
      total: total ?? list.length,
      current,
      pageSize,
    },
    ...emptyMeta,
  };
}

export function okUpdate(data: UpdateResponse['data']): UpdateResponse {
  return {
    success: true,
    data,
    ...emptyMeta,
  };
}

export function okDelete(data: DeleteResponse['data']): DeleteResponse {
  return {
    success: true,
    data,
    ...emptyMeta,
  };
}
