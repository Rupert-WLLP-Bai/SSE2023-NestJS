import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TotalScore } from './entities/total_score.entity';
import { TotalScoreController } from './total_score.controller';
import { TotalScoreService } from './total_score.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { ExperimentScore } from '../experiment_score/entities/experiment_score.entity';
import { ExperimentWeight } from '../experiment_weight/entities/experiment_weight.entity';
import { ExaminationScore } from '../examination_score/entities/examination_score.entity';
import { ExaminationWeight } from '../examination_weight/entities/examination_weight.entity';
import { EnrollmentService } from '../enrollment/enrollment.service';

describe('TotalScoreController', () => {
  let controller: TotalScoreController;
  let service: TotalScoreService;

  const mockTotalScore = {
    id: 1,
    courseId: 1,
    studentId: 1,
    totalScore: 85.5,
    experimentScore: 60,
    examinationScore: 25.5,
  };

  const mockCreateDto = {
    courseId: 1,
    studentId: 1,
    totalScore: 85.5,
    experimentScore: 60,
    examinationScore: 25.5,
  };

  const mockUpdateDto = {
    totalScore: 90,
  };

  let mockRepository: any;
  let mockEnrollmentService: any;
  let mockDataSource: any;
  let mockService: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      findBy: jest.fn().mockResolvedValue([]),
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

    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByCourse: jest.fn(),
      findByStudent: jest.fn(),
      findCommon: jest.fn(),
      recalculate: jest.fn(),
      findByCourseWithStudents: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TotalScoreController],
      providers: [
        {
          provide: TotalScoreService,
          useValue: mockService,
        },
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

    controller = module.get<TotalScoreController>(TotalScoreController);
    service = module.get<TotalScoreService>(TotalScoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a total score successfully', async () => {
      mockService.create.mockResolvedValue(mockTotalScore);

      const result = await controller.create(mockCreateDto as any);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTotalScore);
      expect(mockService.create).toHaveBeenCalledWith(mockCreateDto);
    });

    it('should handle create error', async () => {
      mockService.create.mockRejectedValue(new Error('Create failed'));

      const result = await controller.create(mockCreateDto as any);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Create failed');
    });
  });

  describe('findAll', () => {
    it('should return all total scores', async () => {
      const scores = [mockTotalScore];
      mockService.findAll.mockResolvedValue(scores);

      const result = await controller.findAll();

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual(scores);
      expect(result.data.total).toBe(1);
    });

    it('should handle findAll error', async () => {
      mockService.findAll.mockRejectedValue(new Error('Find all failed'));

      const result = await controller.findAll();

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Find all failed');
    });

    it('should return empty list when no scores', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
      expect(result.data.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return total score by id', async () => {
      mockService.findOne.mockResolvedValue(mockTotalScore);

      const result = await controller.findOne(1);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockTotalScore]);
      expect(result.data.total).toBe(1);
    });

    it('should return empty list when score not found', async () => {
      mockService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
      expect(result.data.total).toBe(0);
    });

    it('should handle findOne error', async () => {
      mockService.findOne.mockRejectedValue(new Error('Find one failed'));

      const result = await controller.findOne(1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Find one failed');
    });
  });

  describe('update', () => {
    it('should update total score successfully', async () => {
      const updatedScore = { ...mockTotalScore, totalScore: 90 };
      mockService.update.mockResolvedValue(updatedScore);

      const result = await controller.update(1, mockUpdateDto as any);

      expect(result.success).toBe(true);
      expect(mockService.update).toHaveBeenCalledWith(1, mockUpdateDto);
    });

    it('should handle update error', async () => {
      mockService.update.mockRejectedValue(new Error('Update failed'));

      const result = await controller.update(1, mockUpdateDto as any);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Update failed');
    });
  });

  describe('remove', () => {
    it('should delete total score successfully', async () => {
      mockService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove(1);

      expect(result.success).toBe(true);
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });

    it('should handle delete error', async () => {
      mockService.remove.mockRejectedValue(new Error('Delete failed'));

      const result = await controller.remove(1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Delete failed');
    });
  });

  describe('findCommon', () => {
    it('should return paginated results', async () => {
      const query = { page: 1, limit: 10, courseId: 1 };
      const result = [[mockTotalScore], 1];
      mockService.findCommon.mockResolvedValue(result);

      const response = await controller.findCommon(query);

      expect(response.success).toBe(true);
      expect(response.data.list).toEqual([mockTotalScore]);
      expect(response.data.total).toBe(1);
      expect(response.data.current).toBe(1);
      expect(response.data.pageSize).toBe(10);
    });

    it('should use default pagination values', async () => {
      const query = {};
      const result = [[mockTotalScore], 1];
      mockService.findCommon.mockResolvedValue(result);

      const response = await controller.findCommon(query);

      expect(response.data.current).toBe(1);
      expect(response.data.pageSize).toBe(10);
    });

    it('should handle findCommon error', async () => {
      mockService.findCommon.mockRejectedValue(new Error('Query failed'));

      const result = await controller.findCommon({});

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Query failed');
    });
  });

  describe('recalculate', () => {
    it('should recalculate course scores successfully', async () => {
      const scores = [mockTotalScore, { ...mockTotalScore, id: 2 }];
      mockService.recalculate.mockResolvedValue(scores);

      const result = await controller.recalculate(1);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual(scores);
      expect(result.data.total).toBe(2);
      expect(mockService.recalculate).toHaveBeenCalledWith(1);
    });

    it('should handle recalculate error', async () => {
      mockService.recalculate.mockRejectedValue(
        new Error('Recalculate failed'),
      );

      const result = await controller.recalculate(1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Recalculate failed');
    });

    it('should return empty when no students', async () => {
      mockService.recalculate.mockResolvedValue([]);

      const result = await controller.recalculate(1);

      expect(result.success).toBe(true);
      expect(result.data.total).toBe(0);
    });
  });

  describe('findByCourse', () => {
    it('should return scores by course id', async () => {
      const scores = [mockTotalScore];
      mockService.findByCourseWithStudents.mockResolvedValue(scores);

      const result = await controller.findByCourse(1);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual(scores);
      expect(result.data.total).toBe(1);
      expect(mockService.findByCourseWithStudents).toHaveBeenCalledWith(1);
    });

    it('should return empty when no scores for course', async () => {
      mockService.findByCourseWithStudents.mockResolvedValue([]);

      const result = await controller.findByCourse(999);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
      expect(result.data.total).toBe(0);
    });

    it('should handle findByCourse error', async () => {
      mockService.findByCourseWithStudents.mockRejectedValue(
        new Error('Find by course failed'),
      );

      const result = await controller.findByCourse(1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Find by course failed');
    });

    it('should return scores sorted by totalScore descending', async () => {
      const scores = [
        { ...mockTotalScore, totalScore: 95 },
        { ...mockTotalScore, id: 2, totalScore: 85 },
      ];
      mockService.findByCourseWithStudents.mockResolvedValue(scores);

      const result = await controller.findByCourse(1);

      expect(result.success).toBe(true);
      // Service should return sorted by totalScore DESC
      expect(result.data.list[0].totalScore).toBe(95);
    });
  });
});
