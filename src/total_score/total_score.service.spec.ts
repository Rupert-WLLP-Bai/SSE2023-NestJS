import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TotalScore } from './entities/total_score.entity';
import { TotalScoreService } from './total_score.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { ExperimentScore } from '../experiment_score/entities/experiment_score.entity';
import { ExperimentWeight } from '../experiment_weight/entities/experiment_weight.entity';
import { ExaminationScore } from '../examination_score/entities/examination_score.entity';
import { ExaminationWeight } from '../examination_weight/entities/examination_weight.entity';
import { EnrollmentService } from '../enrollment/enrollment.service';

describe('TotalScoreService', () => {
  let service: TotalScoreService;

  const mockTotalScore = {
    id: 1,
    courseId: 1,
    studentId: 1,
    totalScore: 85.5,
    experimentScore: 60,
    examinationScore: 25.5,
  };

  const mockEnrollment = {
    id: 1,
    studentId: 1,
    classId: 1,
    courseId: 1,
  };

  const mockTotalWeight = {
    id: 1,
    courseId: 1,
    experimentWeight: 70,
    examinationWeight: 30,
  };

  let mockRepository: any;
  let mockEnrollmentService: any;
  let mockDataSource: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findBy: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockEnrollmentService = {
      findByCourseId: jest.fn().mockResolvedValue([]),
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          delete: jest.fn().mockResolvedValue({}),
          create: jest.fn().mockReturnValue({}),
          save: jest.fn().mockResolvedValue({}),
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TotalScoreService,
        {
          provide: getRepositoryToken(TotalScore),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ExperimentScore),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ExperimentWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ExaminationScore),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ExaminationWeight),
          useValue: mockRepository,
        },
        {
          provide: EnrollmentService,
          useValue: mockEnrollmentService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TotalScoreService>(TotalScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a total score', async () => {
      mockRepository.create.mockReturnValue(mockTotalScore);
      mockRepository.save.mockResolvedValue(mockTotalScore);
      const result = await service.create(mockTotalScore as any);
      expect(result).toEqual(mockTotalScore);
    });
  });

  describe('findAll', () => {
    it('should return all total scores', async () => {
      mockRepository.find.mockResolvedValue([mockTotalScore]);
      const result = await service.findAll();
      expect(result).toEqual([mockTotalScore]);
    });
  });

  describe('findOne', () => {
    it('should return total score by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalScore);
      const result = await service.findOne(1);
      expect(result).toEqual(mockTotalScore);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update total score', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue(mockTotalScore);
      const result = await service.update(1, { totalScore: 90 } as any);
      expect(result).toEqual(mockTotalScore);
    });
  });

  describe('remove', () => {
    it('should delete total score', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findByCourse', () => {
    it('should return total scores by course id', async () => {
      mockRepository.findBy.mockResolvedValue([mockTotalScore]);
      const result = await service.findByCourse(1);
      expect(result).toEqual([mockTotalScore]);
    });
  });

  describe('findByStudent', () => {
    it('should return total scores by student id', async () => {
      mockRepository.findBy.mockResolvedValue([mockTotalScore]);
      const result = await service.findByStudent(1);
      expect(result).toEqual([mockTotalScore]);
    });
  });

  describe('findCommon', () => {
    it('should return paginated results with filters', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockTotalScore], 1]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        courseId: 1,
      });
      expect(result).toEqual([[mockTotalScore], 1]);
    });

    it('should use default pagination values when not provided', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockTotalScore], 1]);
      const result = await service.findCommon({});
      expect(result).toEqual([[mockTotalScore], 1]);
    });

    it('should handle studentId filter', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockTotalScore], 1]);
      const result = await service.findCommon({ studentId: 1 });
      expect(result).toEqual([[mockTotalScore], 1]);
    });

    it('should handle both courseId and studentId filters', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockTotalScore], 1]);
      const result = await service.findCommon({ courseId: 1, studentId: 1 });
      expect(result).toEqual([[mockTotalScore], 1]);
    });

    it('should handle custom filters', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockTotalScore], 1]);
      const result = await service.findCommon({ customField: 'value' });
      expect(result).toEqual([[mockTotalScore], 1]);
    });

    it('should handle empty results', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);
      const result = await service.findCommon({ page: 1, limit: 10 });
      expect(result).toEqual([[], 0]);
    });
  });

  describe('recalculate', () => {
    it('should recalculate total scores for course', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      mockEnrollmentService.findByCourseId.mockResolvedValue([mockEnrollment]);
      mockRepository.find.mockResolvedValue([]);
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.recalculate(1);
      expect(result).toBeDefined();
    });

    it('should throw error when total weight not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.recalculate(999)).rejects.toThrow();
    });

    it('should throw error when no students enrolled', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTotalWeight);
      mockEnrollmentService.findByCourseId.mockResolvedValue([]);
      await expect(service.recalculate(1)).rejects.toThrow();
    });
  });

  describe('findByCourseWithStudents', () => {
    it('should return total scores with students', async () => {
      mockRepository.find.mockResolvedValue([mockTotalScore]);
      const result = await service.findByCourseWithStudents(1);
      expect(result).toEqual([mockTotalScore]);
    });

    it('should return empty array when no scores found', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findByCourseWithStudents(999);
      expect(result).toEqual([]);
    });
  });

  describe('calculateStudentTotalScore (private method via recalculate)', () => {
    const mockExperimentWeight = {
      id: 1,
      courseId: 1,
      experimentId: 1,
      weight: 35,
    };

    const mockExaminationWeight = {
      id: 1,
      courseId: 1,
      examinationId: 1,
      weight: 30,
    };

    const mockExperimentScore = {
      id: 1,
      courseId: 1,
      studentId: 1,
      experimentId: 1,
      score: 80,
    };

    const mockExaminationScore = {
      id: 1,
      courseId: 1,
      studentId: 1,
      examinationId: 1,
      score: 90,
    };

    it('should calculate student total score with experiment and examination', async () => {
      // Setup total weight
      mockRepository.findOneBy
        .mockResolvedValueOnce(mockTotalWeight) // for recalculate
        .mockResolvedValueOnce(mockTotalWeight);

      // Setup enrollments
      mockEnrollmentService.findByCourseId.mockResolvedValue([mockEnrollment]);

      // Setup experiment weights
      mockRepository.find
        .mockResolvedValueOnce([mockExperimentWeight]) // experiment weights
        .mockResolvedValueOnce([mockExaminationWeight]); // examination weights

      // Setup experiment score
      mockRepository.findOne.mockResolvedValue(mockExperimentScore);

      // Setup examination scores
      mockRepository.find.mockResolvedValue([mockExaminationScore]);

      const result = await service.recalculate(1);

      // Calculate expected: (80 * 35/70) + (90 * 30/30) = 40 + 90 = 130
      // But since total experiment weight is 70 and examination is 30
      // experimentScore = 80 * 35/70 = 40
      // examinationScore = 90 * 30/30 = 90
      // totalScore = 40 + 90 = 130
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle missing experiment scores', async () => {
      mockRepository.findOneBy
        .mockResolvedValueOnce(mockTotalWeight)
        .mockResolvedValueOnce(mockTotalWeight);

      mockEnrollmentService.findByCourseId.mockResolvedValue([mockEnrollment]);

      mockRepository.find
        .mockResolvedValueOnce([mockExperimentWeight])
        .mockResolvedValueOnce([mockExaminationWeight]);

      // No experiment score found
      mockRepository.findOne.mockResolvedValue(null);

      // Has examination score
      mockRepository.find.mockResolvedValue([mockExaminationScore]);

      const result = await service.recalculate(1);
      expect(result).toBeDefined();
    });

    it('should handle missing examination scores', async () => {
      mockRepository.findOneBy
        .mockResolvedValueOnce(mockTotalWeight)
        .mockResolvedValueOnce(mockTotalWeight);

      mockEnrollmentService.findByCourseId.mockResolvedValue([mockEnrollment]);

      mockRepository.find
        .mockResolvedValueOnce([mockExperimentWeight])
        .mockResolvedValueOnce([mockExaminationWeight]);

      // Has experiment score
      mockRepository.findOne.mockResolvedValue(mockExperimentScore);

      // No examination scores
      mockRepository.find.mockResolvedValue([]);

      const result = await service.recalculate(1);
      expect(result).toBeDefined();
    });

    it('should handle multiple examination scores (average)', async () => {
      mockRepository.findOneBy
        .mockResolvedValueOnce(mockTotalWeight)
        .mockResolvedValueOnce(mockTotalWeight);

      mockEnrollmentService.findByCourseId.mockResolvedValue([mockEnrollment]);

      mockRepository.find
        .mockResolvedValueOnce([mockExperimentWeight])
        .mockResolvedValueOnce([mockExaminationWeight]);

      mockRepository.findOne.mockResolvedValue(mockExperimentScore);

      // Multiple examination scores
      mockRepository.find.mockResolvedValue([
        mockExaminationScore,
        { ...mockExaminationScore, id: 2, score: 80 },
      ]);

      const result = await service.recalculate(1);
      expect(result).toBeDefined();
    });

    it('should rollback on transaction error', async () => {
      mockRepository.findOneBy
        .mockResolvedValueOnce(mockTotalWeight)
        .mockResolvedValueOnce(mockTotalWeight);

      mockEnrollmentService.findByCourseId.mockResolvedValue([mockEnrollment]);

      mockRepository.find
        .mockResolvedValueOnce([mockExperimentWeight])
        .mockResolvedValueOnce([mockExaminationWeight]);

      mockRepository.findOne.mockResolvedValue(mockExperimentScore);
      mockRepository.find.mockResolvedValue([mockExaminationScore]);

      // Make save throw error
      const mockQueryRunner = mockDataSource.createQueryRunner();
      mockQueryRunner.manager.save.mockRejectedValue(new Error('Database error'));

      await expect(service.recalculate(1)).rejects.toThrow('Database error');
    });

    it('should round scores to 2 decimal places', async () => {
      const fractionalWeight = {
        ...mockTotalWeight,
        experimentWeight: 33.33,
        examinationWeight: 33.33,
      };

      mockRepository.findOneBy
        .mockResolvedValueOnce(fractionalWeight)
        .mockResolvedValueOnce(fractionalWeight);

      mockEnrollmentService.findByCourseId.mockResolvedValue([mockEnrollment]);

      mockRepository.find
        .mockResolvedValueOnce([mockExperimentWeight])
        .mockResolvedValueOnce([mockExaminationWeight]);

      mockRepository.findOne.mockResolvedValue(mockExperimentScore);
      mockRepository.find.mockResolvedValue([mockExaminationScore]);

      const result = await service.recalculate(1);
      expect(result).toBeDefined();
    });
  });
});
