import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperimentScore } from './entities/experiment_score.entity';
import { ExperimentScoreService } from './experiment_score.service';

describe('ExperimentScoreService', () => {
  let service: ExperimentScoreService;
  let mockRepository: any;

  const mockExperimentScore = {
    id: 1,
    courseId: 1,
    experimentId: 1,
    studentId: 1,
    score: 85,
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findBy: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentScoreService,
        {
          provide: getRepositoryToken(ExperimentScore),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExperimentScoreService>(ExperimentScoreService);
  });

  describe('create', () => {
    it('should create an experiment score', async () => {
      mockRepository.create.mockReturnValue(mockExperimentScore);
      mockRepository.save.mockResolvedValue(mockExperimentScore);
      const result = await service.create({
        courseId: 1,
        experimentId: 1,
        studentId: 1,
        score: 85,
      });
      expect(result).toEqual(mockExperimentScore);
    });
  });

  describe('findAll', () => {
    it('should return all experiment scores', async () => {
      mockRepository.find.mockResolvedValue([mockExperimentScore]);
      const result = await service.findAll();
      expect(result).toEqual([mockExperimentScore]);
    });
  });

  describe('findOne', () => {
    it('should return experiment score by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockExperimentScore);
      const result = await service.findOne(1);
      expect(result).toEqual(mockExperimentScore);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('findOneByCondition', () => {
    it('should return experiment score by condition', async () => {
      mockRepository.findOne.mockResolvedValue(mockExperimentScore);
      const result = await service.findOneByCondition({ studentId: 1 });
      expect(result).toEqual(mockExperimentScore);
    });
  });

  describe('update', () => {
    it('should update experiment score', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue({
        ...mockExperimentScore,
        score: 90,
      });
      const result = await service.update(1, { score: 90 } as any);
      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should delete experiment score', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findByExperiment', () => {
    it('should return experiment scores by experiment id', async () => {
      mockRepository.findBy.mockResolvedValue([mockExperimentScore]);
      const result = await service.findByExperiment(1);
      expect(result).toEqual([mockExperimentScore]);
    });
  });

  describe('findByStudent', () => {
    it('should return experiment scores by student id', async () => {
      mockRepository.findBy.mockResolvedValue([mockExperimentScore]);
      const result = await service.findByStudent(1);
      expect(result).toEqual([mockExperimentScore]);
    });
  });

  describe('findByCourse', () => {
    it('should return experiment scores by course id', async () => {
      mockRepository.findBy.mockResolvedValue([mockExperimentScore]);
      const result = await service.findByCourse(1);
      expect(result).toEqual([mockExperimentScore]);
    });
  });

  describe('findByCourseAndStudent', () => {
    it('should return experiment scores by course and student', async () => {
      mockRepository.findBy.mockResolvedValue([mockExperimentScore]);
      const result = await service.findByCourseAndStudent(1, 1);
      expect(result).toEqual([mockExperimentScore]);
    });
  });

  describe('findCommon', () => {
    it('should return paginated results', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockExperimentScore], 1]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        experimentId: 1,
      });
      expect(result).toEqual([[mockExperimentScore], 1]);
    });

    it('should use default pagination when page and limit not provided', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockExperimentScore], 1]);
      const result = await service.findCommon({});
      expect(result).toEqual([[mockExperimentScore], 1]);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { id: 'DESC' },
      });
    });

    it('should filter by studentId', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockExperimentScore], 1]);
      const result = await service.findCommon({ studentId: 1 });
      expect(result).toEqual([[mockExperimentScore], 1]);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ studentId: 1 }),
        }),
      );
    });

    it('should filter by both experimentId and studentId', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockExperimentScore], 1]);
      const result = await service.findCommon({
        experimentId: 1,
        studentId: 1,
      });
      expect(result).toEqual([[mockExperimentScore], 1]);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ experimentId: 1, studentId: 1 }),
        }),
      );
    });

    it('should support additional filters', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockExperimentScore], 1]);
      const result = await service.findCommon({ courseId: 1, experimentId: 1 });
      expect(result).toEqual([[mockExperimentScore], 1]);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ courseId: 1, experimentId: 1 }),
        }),
      );
    });
  });

  describe('upsert', () => {
    it('should update existing record', async () => {
      mockRepository.findOne.mockResolvedValue(mockExperimentScore);
      mockRepository.save.mockResolvedValue({
        ...mockExperimentScore,
        score: 90,
      });
      const result = await service.upsert({
        courseId: 1,
        experimentId: 1,
        studentId: 1,
        score: 90,
      });
      expect(result).toBeDefined();
    });

    it('should create new record if not exists', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockExperimentScore);
      mockRepository.save.mockResolvedValue(mockExperimentScore);
      const result = await service.upsert({
        courseId: 1,
        experimentId: 1,
        studentId: 1,
        score: 85,
      });
      expect(result).toBeDefined();
    });
  });
});
