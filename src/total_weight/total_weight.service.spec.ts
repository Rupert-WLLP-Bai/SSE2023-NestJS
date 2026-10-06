import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TotalWeight } from './entities/total_weight.entity';
import { TotalWeightService } from './total_weight.service';

describe('TotalWeightService', () => {
  let service: TotalWeightService;
  let mockRepository: any;

  const mockTotalWeight = {
    id: 1,
    courseId: 1,
    experimentWeight: 70,
    examinationWeight: 30,
  };

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TotalWeightService,
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TotalWeightService>(TotalWeightService);
  });

  describe('create', () => {
    it('should create new total weight with valid weights', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockTotalWeight);
      mockRepository.save.mockResolvedValue(mockTotalWeight);
      const result = await service.create({
        courseId: 1,
        experimentWeight: 70,
        examinationWeight: 30,
      });
      expect(result).toEqual(mockTotalWeight);
    });

    it('should update existing record if course already has weight', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      mockRepository.save.mockResolvedValue(mockTotalWeight);
      const result = await service.create({
        courseId: 1,
        experimentWeight: 60,
        examinationWeight: 40,
      });
      expect(result).toEqual(mockTotalWeight);
    });

    it('should throw error when weight sum is not 100', async () => {
      await expect(
        service.create({
          courseId: 1,
          experimentWeight: 50,
          examinationWeight: 30,
        }),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all total weights', async () => {
      mockRepository.find.mockResolvedValue([mockTotalWeight]);
      const result = await service.findAll();
      expect(result).toEqual([mockTotalWeight]);
    });
  });

  describe('findOne', () => {
    it('should return total weight by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      const result = await service.findOne(1);
      expect(result).toEqual(mockTotalWeight);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('findByCourse', () => {
    it('should return total weight by course id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      const result = await service.findByCourse(1);
      expect(result).toEqual(mockTotalWeight);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findByCourse(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update with both weights valid', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue({
        ...mockTotalWeight,
        experimentWeight: 60,
        examinationWeight: 40,
      });
      const result = await service.update(1, {
        experimentWeight: 60,
        examinationWeight: 40,
      } as any);
      expect(result).toBeDefined();
    });

    it('should throw error when updating with invalid sum', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      await expect(
        service.update(1, {
          experimentWeight: 50,
          examinationWeight: 40,
        } as any),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete total weight', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
