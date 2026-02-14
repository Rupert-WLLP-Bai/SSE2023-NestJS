import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有设置角色要求，放行
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 如果用户没有角色信息，拒绝访问
    if (!user || user.role === undefined) {
      throw new ForbiddenException({
        success: false,
        errorCode: 'FORBIDDEN',
        errorMessage: '无权访问：缺少角色信息',
        showType: 2,
      });
    }

    // 检查用户角色是否在要求的角色中
    const userRole = Number(user.role);
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException({
        success: false,
        errorCode: 'FORBIDDEN',
        errorMessage: '无权访问：权限不足',
        showType: 2,
      });
    }

    return true;
  }
}
