import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperimentWeight } from './entities/experiment_weight.entity';
import { ExperimentWeightController } from './experiment_weight.controller';
import { ExperimentWeightService } from './experiment_weight.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { AuditService } from '../audit/audit.service';
import { AuditLog } from '../audit/entities/audit_log.entity';

describe('ExperimentWeightController', () => {
  let controller: ExperimentWeightController;
  let service: ExperimentWeightService;
  let mockRepository: any;
  let mockAuditRepository: any;

  const mockExperimentWeight: Partial<ExperimentWeight> = {
    id: 1,
    courseId: 1,
    experimentId: 1,
    weight: 20,
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
      controllers: [ExperimentWeightController],
      providers: [
        ExperimentWeightService,
        AuditService,
        {
          provide: getRepositoryToken(ExperimentWeight),
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

    controller = module.get<ExperimentWeightController>(
      ExperimentWeightController,
    );
    service = module.get<ExperimentWeightService>(ExperimentWeightService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create experiment weight successfully', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockExperimentWeight as ExperimentWeight);
      mockAuditRepository.create.mockReturnValue({});
      mockAuditRepository.save.mockResolvedValue({});

      const result = await controller.create(
        { courseId: 1, experimentId: 1, weight: 20 },
        mockUser,
        mockReq,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockExperimentWeight);
    });

    it('should handle create error', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error('Create failed'));

      const result = await controller.create(
        { courseId: 1, experimentId: 1, weight: 20 },
        mockUser,
        mockReq,
      );

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Create failed');
    });
  });

  describe('findAll', () => {
    it('should return all experiment weights', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockExperimentWeight] as ExperimentWeight[]);

      const result = await controller.findAll();

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockExperimentWeight]);
      expect(result.data.total).toBe(1);
    });

    it('should handle findAll error', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error('Find all failed'));

      const result = await controller.findAll();

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Find all failed');
    });
  });

  describe('findOne', () => {
    it('should return experiment weight by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockExperimentWeight as ExperimentWeight);

      const result = await controller.findOne(1);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockExperimentWeight]);
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
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('Find one failed'));

      const result = await controller.findOne(1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Find one failed');
    });
  });

  describe('update', () => {
    it('should update experiment weight successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockExperimentWeight as ExperimentWeight);
      jest.spyOn(service, 'update').mockResolvedValue({
        ...mockExperimentWeight,
        weight: 30,
      } as ExperimentWeight);
      mockAuditRepository.create.mockReturnValue({});
      mockAuditRepository.save.mockResolvedValue({});

      const result = await controller.update(
        1,
        { weight: 30 },
        mockUser,
        mockReq,
      );

      expect(result.success).toBe(true);
    });

    it('should handle update error', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockExperimentWeight as ExperimentWeight);
      jest.spyOn(service, 'update').mockRejectedValue(new Error('Update failed'));

      const result = await controller.update(
        1,
        { weight: 30 },
        mockUser,
        mockReq,
      );

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Update failed');
    });
  });

  describe('remove', () => {
    it('should delete experiment weight successfully', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ affected: 1, raw: [] });

      const result = await controller.remove(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ affected: 1, raw: [] });
    });

    it('should handle remove error', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new Error('Delete failed'));

      const result = await controller.remove(1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Delete failed');
    });
  });

  describe('findCommon', () => {
    it('should return paginated results', async () => {
      jest
        .spyOn(service, 'findCommon')
        .mockResolvedValue([[mockExperimentWeight] as ExperimentWeight[], 1]);

      const result = await controller.findCommon({
        page: 1,
        limit: 10,
        courseId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockExperimentWeight]);
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
