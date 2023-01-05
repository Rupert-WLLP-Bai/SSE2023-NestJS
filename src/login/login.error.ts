/**
 * @description
 * This enum contains all the error codes for login errors.
 * @enum loginErrorCodes
 * @memberof login
 */
export enum loginErrorCodes {
  // 10001: 用户不存在
  USER_NOT_EXIST = '10001',
  // 10002: 密码错误
  PASSWORD_ERROR = '10002',
  // 10003: 用户已存在
  USER_EXIST = '10003',
  // 10004: 用户名或密码错误
  USER_OR_PASSWORD_ERROR = '10004',
}
