import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationWeight } from './entities/examination_weight.entity';
import { ExaminationWeightService } from './examination_weight.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';

describe('ExaminationWeightService', () => {
  let service: ExaminationWeightService;
  let mockRepository: any;

  const mockExaminationWeight = {
    id: 1,
    courseId: 1,
    examinationId: 1,
    weight: 30,
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
        ExaminationWeightService,
        {
          provide: getRepositoryToken(ExaminationWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExaminationWeightService>(ExaminationWeightService);
  });

  describe('create', () => {
    it('should create examination weight with valid sum', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      mockRepository.findBy.mockResolvedValue([]);
      mockRepository.create.mockReturnValue(mockExaminationWeight);
      mockRepository.save.mockResolvedValue(mockExaminationWeight);
      const result = await service.create({
        courseId: 1,
        examinationId: 1,
        weight: 15,
      });
      expect(result).toEqual(mockExaminationWeight);
    });

    it('should throw error when total weight not set', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.create({
          courseId: 1,
          examinationId: 1,
          weight: 15,
        }),
      ).rejects.toThrow();
    });

    it('should throw error when weight sum exceeded', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      mockRepository.findBy.mockResolvedValue([{ id: 1, weight: 25 }]);
      await expect(
        service.create({
          courseId: 1,
          examinationId: 2,
          weight: 10,
        }),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all examination weights', async () => {
      mockRepository.find.mockResolvedValue([mockExaminationWeight]);
      const result = await service.findAll();
      expect(result).toEqual([mockExaminationWeight]);
    });
  });

  describe('findOne', () => {
    it('should return examination weight by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockExaminationWeight);
      const result = await service.findOne(1);
      expect(result).toEqual(mockExaminationWeight);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update examination weight', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(mockExaminationWeight);
      mockRepository.findOneBy.mockResolvedValueOnce(mockTotalWeight);
      mockRepository.findBy.mockResolvedValue([]);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue({
        ...mockExaminationWeight,
        weight: 20,
      });
      const result = await service.update(1, { weight: 20 } as any);
      expect(result).toBeDefined();
    });

    it('should throw error when examination weight not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.update(999, { weight: 20 } as any),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete examination weight', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findByCourse', () => {
    it('should return examination weights by course id', async () => {
      mockRepository.findBy.mockResolvedValue([mockExaminationWeight]);
      const result = await service.findByCourse(1);
      expect(result).toEqual([mockExaminationWeight]);
    });
  });

  describe('findByExamination', () => {
    it('should return examination weights by examination id', async () => {
      mockRepository.findBy.mockResolvedValue([mockExaminationWeight]);
      const result = await service.findByExamination(1);
      expect(result).toEqual([mockExaminationWeight]);
    });
  });

  describe('findCommon', () => {
    it('should return paginated results', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [mockExaminationWeight],
        1,
      ]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        courseId: 1,
      });
      expect(result).toEqual([[mockExaminationWeight], 1]);
    });
  });
});
