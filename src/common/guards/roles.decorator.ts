import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';

/**
 * @file Roles 装饰器
 * @description 用于在 Controller 或 Handler 上设置角色权限
 * @author SSE Team
 */

/**
 * Roles 装饰器元数据键名
 */
export const ROLES_KEY = 'roles';

/**
 * Roles 装饰器
 *
 * @example
 * // 单个角色
 * @Roles(UserRole.TEACHER)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 *
 * // 多个角色
 * @Roles(UserRole.TEACHER, UserRole.ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 *
 * @param roles - 用户角色列表
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
