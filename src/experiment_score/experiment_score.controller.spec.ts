import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperimentScore } from './entities/experiment_score.entity';
import { ExperimentScoreController } from './experiment_score.controller';
import { ExperimentScoreService } from './experiment_score.service';
import { AuditService } from '../audit/audit.service';
import { AuditLog } from '../audit/entities/audit_log.entity';

describe('ExperimentScoreController', () => {
  let controller: ExperimentScoreController;
  let mockService: any;
  let mockRepository: any;
  let mockAuditService: any;

  const mockExperimentScore = {
    id: 1,
    courseId: 1,
    experimentId: 1,
    studentId: 1,
    score: 85,
    createTime: new Date(),
    updateTime: new Date(),
  };

  const createDto = {
    courseId: 1,
    experimentId: 1,
    studentId: 1,
    score: 85,
  };

  const updateDto = {
    score: 90,
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findOneByCondition: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByExperiment: jest.fn(),
      findByStudent: jest.fn(),
      findCommon: jest.fn(),
      upsert: jest.fn(),
      findByCourse: jest.fn(),
      findByCourseAndStudent: jest.fn(),
    };

    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockAuditService = {
      create: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentScoreController],
      providers: [
        {
          provide: ExperimentScoreService,
          useValue: mockService,
        },
        {
          provide: getRepositoryToken(ExperimentScore),
          useValue: mockRepository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    controller = module.get<ExperimentScoreController>(ExperimentScoreController);
  });

  describe('create', () => {
    it('should create an experiment score', async () => {
      mockService.create.mockResolvedValue(mockExperimentScore);

      const response = await controller.create(createDto, { id: 1, username: 'teacher1' }, { ip: '127.0.0.1', headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockExperimentScore);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
      expect(mockAuditService.create).toHaveBeenCalled();
    });

    it('should create an experiment score with null user', async () => {
      mockService.create.mockResolvedValue(mockExperimentScore);

      const response = await controller.create(createDto, null, { connection: { remoteAddress: '127.0.0.1' }, headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockExperimentScore);
    });

    it('should create an experiment score without ip', async () => {
      mockService.create.mockResolvedValue(mockExperimentScore);

      const response = await controller.create(createDto, { id: 1, username: 'teacher1' }, { headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockExperimentScore);
    });

    it('should return error when create fails', async () => {
      mockService.create.mockRejectedValue(new Error('Validation failed'));

      const response = await controller.create(createDto, { id: 1, username: 'teacher1' }, { ip: '127.0.0.1', headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe('Validation failed');
    });
  });

  describe('findAll', () => {
    it('should return all experiment scores', async () => {
      const scores = [mockExperimentScore];
      mockService.findAll.mockResolvedValue(scores);

      const response = await controller.findAll();

      expect(response.success).toBe(true);
      expect(response.data.list).toEqual(scores);
      expect(response.data.total).toBe(1);
    });

    it('should return empty list when no scores exist', async () => {
      mockService.findAll.mockResolvedValue([]);

      const response = await controller.findAll();

      expect(response.success).toBe(true);
      expect(response.data.list).toEqual([]);
      expect(response.data.total).toBe(0);
    });

    it('should return error when findAll fails', async () => {
      mockService.findAll.mockRejectedValue(new Error('Database error'));

      const response = await controller.findAll();

      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe('Database error');
    });
  });

  describe('findOne', () => {
    it('should return experiment score by id', async () => {
      mockService.findOne.mockResolvedValue(mockExperimentScore);

      const response = await controller.findOne(1);

      expect(response.success).toBe(true);
      expect(response.data.list).toEqual([mockExperimentScore]);
      expect(response.data.total).toBe(1);
    });

    it('should return empty list when score not found', async () => {
      mockService.findOne.mockResolvedValue(null);

      const response = await controller.findOne(999);

      expect(response.success).toBe(true);
      expect(response.data.list).toEqual([]);
      expect(response.data.total).toBe(0);
    });

    it('should return error when findOne fails', async () => {
      mockService.findOne.mockRejectedValue(new Error('Not found'));

      const response = await controller.findOne(1);

      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe('Not found');
    });
  });

  describe('update', () => {
    it('should update experiment score', async () => {
      const updatedScore = { ...mockExperimentScore, score: 90 };
      mockService.findOne.mockResolvedValue(mockExperimentScore);
      mockService.update.mockResolvedValue(updatedScore);

      const response = await controller.update(1, updateDto, { id: 1, username: 'teacher1' }, { ip: '127.0.0.1', headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(true);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
      expect(mockAuditService.create).toHaveBeenCalled();
    });

    it('should update experiment score with null user', async () => {
      const updatedScore = { ...mockExperimentScore, score: 90 };
      mockService.findOne.mockResolvedValue(mockExperimentScore);
      mockService.update.mockResolvedValue(updatedScore);

      const response = await controller.update(1, updateDto, null, { connection: { remoteAddress: '127.0.0.1' }, headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(true);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update experiment score without ip', async () => {
      const updatedScore = { ...mockExperimentScore, score: 90 };
      mockService.findOne.mockResolvedValue(mockExperimentScore);
      mockService.update.mockResolvedValue(updatedScore);

      const response = await controller.update(1, updateDto, { id: 1, username: 'teacher1' }, { headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(true);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should return error when update fails', async () => {
      mockService.findOne.mockResolvedValue(mockExperimentScore);
      mockService.update.mockRejectedValue(new Error('Update failed'));

      const response = await controller.update(1, updateDto, { id: 1, username: 'teacher1' }, { ip: '127.0.0.1', headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe('Update failed');
    });
  });

  describe('remove', () => {
    it('should delete experiment score', async () => {
      mockService.remove.mockResolvedValue({ affected: 1 });

      const response = await controller.remove(1);

      expect(response.success).toBe(true);
      expect(response.data.affected).toBe(1);
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });

    it('should return error when remove fails', async () => {
      mockService.remove.mockRejectedValue(new Error('Delete failed'));

      const response = await controller.remove(1);

      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe('Delete failed');
    });
  });

  describe('findCommon', () => {
    it('should return paginated experiment scores', async () => {
      const scores = [mockExperimentScore];
      mockService.findCommon.mockResolvedValue([scores, 1]);

      const response = await controller.findCommon({ page: 1, limit: 10, experimentId: 1 });

      expect(response.success).toBe(true);
      expect(response.data.list).toEqual(scores);
      expect(response.data.total).toBe(1);
      expect(response.data.current).toBe(1);
      expect(response.data.pageSize).toBe(10);
    });

    it('should use default pagination when not provided', async () => {
      const scores = [mockExperimentScore];
      mockService.findCommon.mockResolvedValue([scores, 1]);

      const response = await controller.findCommon({});

      expect(response.success).toBe(true);
      expect(response.data.current).toBe(1);
      expect(response.data.pageSize).toBe(10);
    });

    it('should return error when findCommon fails', async () => {
      mockService.findCommon.mockRejectedValue(new Error('Query failed'));

      const response = await controller.findCommon({});

      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe('Query failed');
    });
  });

  describe('upsert', () => {
    it('should create new score on upsert', async () => {
      mockService.findOneByCondition.mockResolvedValue(null);
      mockService.upsert.mockResolvedValue(mockExperimentScore);

      const response = await controller.upsert(createDto, { id: 1, username: 'teacher1' }, { ip: '127.0.0.1', headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockExperimentScore);
      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
        }),
      );
    });

    it('should create new score on upsert with null user', async () => {
      mockService.findOneByCondition.mockResolvedValue(null);
      mockService.upsert.mockResolvedValue(mockExperimentScore);

      const response = await controller.upsert(createDto, null, { connection: { remoteAddress: '127.0.0.1' }, headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockExperimentScore);
    });

    it('should create new score on upsert without ip', async () => {
      mockService.findOneByCondition.mockResolvedValue(null);
      mockService.upsert.mockResolvedValue(mockExperimentScore);

      const response = await controller.upsert(createDto, { id: 1, username: 'teacher1' }, { headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockExperimentScore);
    });

    it('should update existing score on upsert', async () => {
      const existingScore = { ...mockExperimentScore, id: 1 };
      mockService.findOneByCondition.mockResolvedValue(existingScore);
      const updatedScore = { ...mockExperimentScore, score: 90 };
      mockService.upsert.mockResolvedValue(updatedScore);

      const response = await controller.upsert(createDto, { id: 1, username: 'teacher1' }, { ip: '127.0.0.1', headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(true);
      expect(mockAuditService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'UPDATE',
        }),
      );
    });

    it('should return error when upsert fails', async () => {
      mockService.findOneByCondition.mockResolvedValue(null);
      mockService.upsert.mockRejectedValue(new Error('Upsert failed'));

      const response = await controller.upsert(createDto, { id: 1, username: 'teacher1' }, { ip: '127.0.0.1', headers: { 'user-agent': 'test' } });

      expect(response.success).toBe(false);
      expect(response.errorMessage).toBe('Upsert failed');
    });
  });
});
