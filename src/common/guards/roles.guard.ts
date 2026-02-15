import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../../user/entities/user.entity';
import { CommonErrorCode } from '../constants/error-codes';

/**
 * @file Roles Guard
 * @description 基于角色的访问控制守卫
 * @author SSE Team
 */

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取需要的角色
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有设置角色要求，放行
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 获取请求中的用户信息
    const { user } = context.switchToHttp().getRequest();

    // 验证用户是否存在
    if (!user) {
      throw new ForbiddenException({
        success: false,
        errorCode: CommonErrorCode.UNAUTHORIZED,
        errorMessage: '未授权：用户信息不存在',
        showType: 1,
      });
    }

    // 验证用户角色是否存在
    if (user.role === undefined || user.role === null) {
      throw new ForbiddenException({
        success: false,
        errorCode: CommonErrorCode.FORBIDDEN,
        errorMessage: '无权访问：缺少角色信息',
        showType: 1,
      });
    }

    // 将用户角色转换为数字进行比较
    const userRole = Number(user.role);

    // 检查用户角色是否在要求的角色列表中
    const hasPermission = requiredRoles.some(
      (role) => Number(role) === userRole,
    );

    if (!hasPermission) {
      throw new ForbiddenException({
        success: false,
        errorCode: CommonErrorCode.ROLE_FORBIDDEN,
        errorMessage: '无权访问：权限不足',
        showType: 1,
      });
    }

    return true;
  }
}
