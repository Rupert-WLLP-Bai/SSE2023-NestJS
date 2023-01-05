export interface LoginResponse {
  success: boolean;
  data?: {
    token?: string;
    currentAuthority?: string;
  };
  errorCode?: string;
  errorMessage?: string;
  showType?: number;
  traceId?: string;
  host?: string;
}
