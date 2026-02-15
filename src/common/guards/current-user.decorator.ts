import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @file CurrentUser 装饰器
 * @description 获取当前登录用户的信息
 * @author SSE Team
 */

/**
 * JWT 用户信息接口
 */
export interface JwtUser {
  /**
   * 用户ID
   */
  id: number;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 姓名
   */
  name?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 角色
   */
  role: number;
  /**
   * 用户状态
   */
  status?: number;
  /**
   * 其他信息
   */
  [key: string]: unknown;
}

/**
 * CurrentUser 装饰器工厂函数
 *
 * @example
 * // 获取完整用户信息
 * @CurrentUser() user: JwtUser
 *
 * // 获取特定字段
 * @CurrentUser('id') userId: number
 * @CurrentUser('name') userName: string
 * @CurrentUser('role') userRole: number
 *
 * @param data - 可选，指定要获取的用户字段名
 * @param ctx - 执行上下文
 * @returns 指定字段的值或完整的用户对象
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtUser;

    if (!user) {
      return undefined;
    }

    // 如果指定了字段名，返回对应字段的值
    if (data) {
      return user[data];
    }

    // 否则返回完整的用户对象
    return user;
  },
);
