import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../user/entities/user.entity';

describe('AuditController', () => {
  let controller: AuditController;
  let mockAuditService: any;

  const mockAuditLog = {
    id: 1,
    userId: 1,
    userName: 'Test User',
    targetType: 'course',
    targetId: 1,
    action: 'CREATE',
    ipAddress: '127.0.0.1',
    createdAt: new Date(),
  };

  const mockQueryResponse = {
    success: true,
    data: { list: [], total: 0, current: 1, pageSize: 10 },
    errorCode: '',
    errorMessage: '',
    showType: 0,
    traceId: '',
    host: '',
  };

  beforeEach(async () => {
    mockAuditService = {
      findAll: jest.fn(),
      create: jest.fn(),
      findByTarget: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(true)
      .overrideGuard(RolesGuard)
      .useValue(true)
      .compile();

    controller = module.get<AuditController>(AuditController);
  });

  describe('findAll', () => {
    it('should return paginated audit logs', async () => {
      const mockResult = {
        list: [mockAuditLog],
        total: 1,
        current: 1,
        pageSize: 10,
      };
      mockAuditService.findAll.mockResolvedValue(mockResult);

      const query = { page: 1, pageSize: 10 };
      const result = await controller.findAll(query);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockAuditLog]);
      expect(result.data.total).toBe(1);
      expect(result.data.current).toBe(1);
      expect(result.data.pageSize).toBe(10);
      expect(mockAuditService.findAll).toHaveBeenCalledWith(query);
    });

    it('should filter by userId', async () => {
      const mockResult = {
        list: [mockAuditLog],
        total: 1,
        current: 1,
        pageSize: 10,
      };
      mockAuditService.findAll.mockResolvedValue(mockResult);

      const query = { userId: 1, page: 1, pageSize: 10 };
      await controller.findAll(query);

      expect(mockAuditService.findAll).toHaveBeenCalledWith(query);
    });

    it('should filter by targetType', async () => {
      const mockResult = {
        list: [mockAuditLog],
        total: 1,
        current: 1,
        pageSize: 10,
      };
      mockAuditService.findAll.mockResolvedValue(mockResult);

      const query = { targetType: 'course', page: 1, pageSize: 10 };
      await controller.findAll(query);

      expect(mockAuditService.findAll).toHaveBeenCalledWith(query);
    });

    it('should filter by action', async () => {
      const mockResult = {
        list: [mockAuditLog],
        total: 1,
        current: 1,
        pageSize: 10,
      };
      mockAuditService.findAll.mockResolvedValue(mockResult);

      const query = { action: 'CREATE', page: 1, pageSize: 10 };
      await controller.findAll(query);

      expect(mockAuditService.findAll).toHaveBeenCalledWith(query);
    });

    it('should filter by date range', async () => {
      const mockResult = {
        list: [mockAuditLog],
        total: 1,
        current: 1,
        pageSize: 10,
      };
      mockAuditService.findAll.mockResolvedValue(mockResult);

      const query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        page: 1,
        pageSize: 10,
      };
      await controller.findAll(query);

      expect(mockAuditService.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle empty result', async () => {
      const mockResult = {
        list: [],
        total: 0,
        current: 1,
        pageSize: 10,
      };
      mockAuditService.findAll.mockResolvedValue(mockResult);

      const query = { page: 1, pageSize: 10 };
      const result = await controller.findAll(query);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
      expect(result.data.total).toBe(0);
    });

    it('should handle service error', async () => {
      mockAuditService.findAll.mockRejectedValue(new Error('Database error'));

      const query = { page: 1, pageSize: 10 };
      const result = await controller.findAll(query);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Database error');
    });
  });
});
