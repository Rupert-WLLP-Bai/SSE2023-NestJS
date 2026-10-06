import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationWeight } from './entities/examination_weight.entity';
import { ExaminationWeightController } from './examination_weight.controller';
import { ExaminationWeightService } from './examination_weight.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { AuditService } from '../audit/audit.service';
import { AuditLog } from '../audit/entities/audit_log.entity';

describe('ExaminationWeightController', () => {
  let controller: ExaminationWeightController;
  let service: ExaminationWeightService;
  let mockRepository: any;
  let mockAuditRepository: any;

  const mockExaminationWeight: Partial<ExaminationWeight> = {
    id: 1,
    courseId: 1,
    examinationId: 1,
    weight: 30,
  };

  const mockTotalWeight: Partial<TotalWeight> = {
    id: 1,
    courseId: 1,
    experimentWeight: 70,
    examinationWeight: 30,
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
  };

  const mockReq = {
    ip: '127.0.0.1',
    connection: { remoteAddress: '127.0.0.1' },
    headers: { 'user-agent': 'test-agent' },
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findBy: jest.fn(),
      findAndCount: jest.fn(),
    };
    mockAuditRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationWeightController],
      providers: [
        ExaminationWeightService,
        AuditService,
        {
          provide: getRepositoryToken(ExaminationWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockAuditRepository,
        },
      ],
    }).compile();

    controller = module.get<ExaminationWeightController>(
      ExaminationWeightController,
    );
    service = module.get<ExaminationWeightService>(ExaminationWeightService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create examination weight successfully', async () => {
      jest
        .spyOn(service, 'create')
        .mockResolvedValue(mockExaminationWeight as ExaminationWeight);
      mockAuditRepository.create.mockReturnValue({});
      mockAuditRepository.save.mockResolvedValue({});

      const result = await controller.create(
        { courseId: 1, examinationId: 1, weight: 30 },
        mockUser,
        mockReq,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockExaminationWeight);
    });

    it('should handle create error', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Create failed'));

      const result = await controller.create(
        { courseId: 1, examinationId: 1, weight: 30 },
        mockUser,
        mockReq,
      );

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Create failed');
    });
  });

  describe('findAll', () => {
    it('should return all examination weights', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue([mockExaminationWeight] as ExaminationWeight[]);

      const result = await controller.findAll();

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockExaminationWeight]);
      expect(result.data.total).toBe(1);
    });

    it('should handle findAll error', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new Error('Find all failed'));

      const result = await controller.findAll();

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Find all failed');
    });
  });

  describe('findOne', () => {
    it('should return examination weight by id', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockExaminationWeight as ExaminationWeight);

      const result = await controller.findOne(1);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockExaminationWeight]);
      expect(result.data.total).toBe(1);
    });

    it('should return empty list when not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
      expect(result.data.total).toBe(0);
    });

    it('should handle findOne error', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Find one failed'));

      const result = await controller.findOne(1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Find one failed');
    });
  });

  describe('update', () => {
    it('should update examination weight successfully', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockExaminationWeight as ExaminationWeight);
      jest.spyOn(service, 'update').mockResolvedValue({
        ...mockExaminationWeight,
        weight: 20,
      } as ExaminationWeight);
      mockAuditRepository.create.mockReturnValue({});
      mockAuditRepository.save.mockResolvedValue({});

      const result = await controller.update(
        1,
        { weight: 20 },
        mockUser,
        mockReq,
      );

      expect(result.success).toBe(true);
    });

    it('should handle update error', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockExaminationWeight as ExaminationWeight);
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Update failed'));

      const result = await controller.update(
        1,
        { weight: 20 },
        mockUser,
        mockReq,
      );

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Update failed');
    });
  });

  describe('remove', () => {
    it('should delete examination weight successfully', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ affected: 1, raw: [] });

      const result = await controller.remove(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ affected: 1, raw: [] });
    });

    it('should handle remove error', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new Error('Delete failed'));

      const result = await controller.remove(1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Delete failed');
    });
  });

  describe('findCommon', () => {
    it('should return paginated results', async () => {
      jest
        .spyOn(service, 'findCommon')
        .mockResolvedValue([[mockExaminationWeight] as ExaminationWeight[], 1]);

      const result = await controller.findCommon({
        page: 1,
        limit: 10,
        courseId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockExaminationWeight]);
      expect(result.data.total).toBe(1);
      expect(result.data.current).toBe(1);
      expect(result.data.pageSize).toBe(10);
    });

    it('should handle findCommon error', async () => {
      jest
        .spyOn(service, 'findCommon')
        .mockRejectedValue(new Error('Query failed'));

      const result = await controller.findCommon({ page: 1, limit: 10 });

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Query failed');
    });
  });
});
