import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit_log.entity';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  let service: AuditService;
  let mockRepository: any;

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

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  describe('create', () => {
    it('should create an audit log', async () => {
      mockRepository.create.mockReturnValue(mockAuditLog);
      mockRepository.save.mockResolvedValue(mockAuditLog);
      const result = await service.create({
        targetType: 'course',
        action: 'CREATE',
      });
      expect(result).toEqual(mockAuditLog);
    });
  });

  describe('findAll', () => {
    it('should return paginated audit logs', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockAuditLog], 1]);
      const result = await service.findAll({
        page: 1,
        pageSize: 10,
      });
      expect(result.list).toEqual([mockAuditLog]);
      expect(result.total).toBe(1);
    });

    it('should filter by userId', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockAuditLog], 1]);
      await service.findAll({
        userId: 1,
        page: 1,
        pageSize: 10,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 1 }),
        }),
      );
    });

    it('should filter by targetType', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockAuditLog], 1]);
      await service.findAll({
        targetType: 'course',
        page: 1,
        pageSize: 10,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ targetType: 'course' }),
        }),
      );
    });

    it('should filter by action', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockAuditLog], 1]);
      await service.findAll({
        action: 'CREATE',
        page: 1,
        pageSize: 10,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ action: 'CREATE' }),
        }),
      );
    });

    it('should filter by targetId', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockAuditLog], 1]);
      await service.findAll({
        targetId: 1,
        page: 1,
        pageSize: 10,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ targetId: 1 }),
        }),
      );
    });

    it('should filter by date range', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockAuditLog], 1]);
      await service.findAll({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        page: 1,
        pageSize: 10,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: expect.anything(),
          }),
        }),
      );
    });

    it('should use default pagination values', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockAuditLog], 1]);
      await service.findAll({});
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        }),
      );
    });
  });

  describe('findByTarget', () => {
    it('should return audit logs by target', async () => {
      mockRepository.find.mockResolvedValue([mockAuditLog]);
      const result = await service.findByTarget('course', 1);
      expect(result).toEqual([mockAuditLog]);
    });
  });
});
