import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../user/entities/user.entity';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const createMockExecutionContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access when no roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
      const context = createMockExecutionContext({
        id: 1,
        role: UserRole.STUDENT,
      });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access when user has admin role and admin is required', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN]);
      const context = createMockExecutionContext({
        id: 1,
        role: UserRole.ADMIN,
      });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access when user has teacher role and teacher is required', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.TEACHER]);
      const context = createMockExecutionContext({
        id: 1,
        role: UserRole.TEACHER,
      });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access when user has one of required roles', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN, UserRole.TEACHER]);
      const context = createMockExecutionContext({
        id: 1,
        role: UserRole.TEACHER,
      });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access when user role is not in required roles', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN, UserRole.TEACHER]);
      const context = createMockExecutionContext({
        id: 1,
        role: UserRole.STUDENT,
      });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should deny access when user has no role', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN]);
      const context = createMockExecutionContext({ id: 1 });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should deny access when user is null', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN]);
      const context = createMockExecutionContext(null);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow student access when student role is required', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.STUDENT]);
      const context = createMockExecutionContext({
        id: 1,
        role: UserRole.STUDENT,
      });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow assistant access when assistant role is required', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ASSISTANT]);
      const context = createMockExecutionContext({
        id: 1,
        role: UserRole.ASSISTANT,
      });

      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
