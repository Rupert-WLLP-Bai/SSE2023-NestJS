import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperimentWeight } from './entities/experiment_weight.entity';
import { ExperimentWeightService } from './experiment_weight.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';

describe('ExperimentWeightService', () => {
  let service: ExperimentWeightService;
  let mockRepository: any;

  const mockExperimentWeight = {
    id: 1,
    courseId: 1,
    experimentId: 1,
    weight: 20,
  };

  const mockTotalWeight = {
    id: 1,
    courseId: 1,
    experimentWeight: 70,
    examinationWeight: 30,
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findBy: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentWeightService,
        {
          provide: getRepositoryToken(ExperimentWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExperimentWeightService>(ExperimentWeightService);
  });

  describe('create', () => {
    it('should create experiment weight with valid sum', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      mockRepository.findBy.mockResolvedValue([]);
      mockRepository.create.mockReturnValue(mockExperimentWeight);
      mockRepository.save.mockResolvedValue(mockExperimentWeight);
      const result = await service.create({
        courseId: 1,
        experimentId: 1,
        weight: 20,
      });
      expect(result).toEqual(mockExperimentWeight);
    });

    it('should throw error when total weight not set', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.create({
          courseId: 1,
          experimentId: 1,
          weight: 20,
        }),
      ).rejects.toThrow();
    });

    it('should throw error when weight sum exceeded', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      mockRepository.findBy.mockResolvedValue([{ id: 1, weight: 60 }]);
      await expect(
        service.create({
          courseId: 1,
          experimentId: 2,
          weight: 20,
        }),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all experiment weights', async () => {
      mockRepository.find.mockResolvedValue([mockExperimentWeight]);
      const result = await service.findAll();
      expect(result).toEqual([mockExperimentWeight]);
    });
  });

  describe('findOne', () => {
    it('should return experiment weight by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockExperimentWeight);
      const result = await service.findOne(1);
      expect(result).toEqual(mockExperimentWeight);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update experiment weight', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(mockExperimentWeight);
      mockRepository.findOneBy.mockResolvedValueOnce(mockTotalWeight);
      mockRepository.findBy.mockResolvedValue([]);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue({
        ...mockExperimentWeight,
        weight: 30,
      });
      const result = await service.update(1, { weight: 30 } as any);
      expect(result).toBeDefined();
    });

    it('should throw error when experiment weight not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.update(999, { weight: 30 } as any),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete experiment weight', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findByCourse', () => {
    it('should return experiment weights by course id', async () => {
      mockRepository.findBy.mockResolvedValue([mockExperimentWeight]);
      const result = await service.findByCourse(1);
      expect(result).toEqual([mockExperimentWeight]);
    });
  });

  describe('findByExperiment', () => {
    it('should return experiment weights by experiment id', async () => {
      mockRepository.findBy.mockResolvedValue([mockExperimentWeight]);
      const result = await service.findByExperiment(1);
      expect(result).toEqual([mockExperimentWeight]);
    });
  });

  describe('findCommon', () => {
    it('should return paginated results', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [mockExperimentWeight],
        1,
      ]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        courseId: 1,
      });
      expect(result).toEqual([[mockExperimentWeight], 1]);
    });
  });
});
