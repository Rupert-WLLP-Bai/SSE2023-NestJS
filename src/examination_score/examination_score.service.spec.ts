import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { ExaminationScore } from './entities/examination_score.entity';
import { ExaminationScoreService } from './examination_score.service';
import { ExaminationSubmitService } from '../examination_submit/examination_submit.service';

describe('ExaminationScoreService', () => {
  let service: ExaminationScoreService;
  let mockRepository: any;
  let mockExaminationSubmitService: any;

  const mockExaminationScore = {
    id: 1,
    courseId: 1,
    examinationId: 1,
    studentId: 1,
    problemId: 1,
    score: 90,
    createTime: new Date(),
    updateTime: new Date(),
  };

  const createDto = {
    courseId: 1,
    examinationId: 1,
    studentId: 1,
    problemId: 1,
    score: 90,
  };

  const updateDto = {
    score: 95,
  };

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

    mockExaminationSubmitService = {
      validateSubmitted: jest.fn().mockResolvedValue(undefined),
      markAsGraded: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationScoreService,
        {
          provide: getRepositoryToken(ExaminationScore),
          useValue: mockRepository,
        },
        {
          provide: ExaminationSubmitService,
          useValue: mockExaminationSubmitService,
        },
      ],
    }).compile();

    service = module.get<ExaminationScoreService>(ExaminationScoreService);
  });

  describe('create', () => {
    it('should create an examination score', async () => {
      mockRepository.create.mockReturnValue(mockExaminationScore);
      mockRepository.save.mockResolvedValue(mockExaminationScore);

      const result = await service.create(createDto);

      expect(result).toEqual(mockExaminationScore);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockExaminationScore);
      expect(
        mockExaminationSubmitService.validateSubmitted,
      ).toHaveBeenCalledWith(createDto.examinationId, createDto.studentId);
    });

    it('should throw error when validateSubmitted fails', async () => {
      mockExaminationSubmitService.validateSubmitted.mockRejectedValue(
        new BadRequestException('Submission not found'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all examination scores', async () => {
      const scores = [mockExaminationScore];
      mockRepository.find.mockResolvedValue(scores);

      const result = await service.findAll();

      expect(result).toEqual(scores);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no scores exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return examination score by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockExaminationScore);

      const result = await service.findOne(1);

      expect(result).toEqual(mockExaminationScore);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findOneByCondition', () => {
    it('should return examination score by condition', async () => {
      const condition = { courseId: 1, studentId: 1 };
      mockRepository.findOne.mockResolvedValue(mockExaminationScore);

      const result = await service.findOneByCondition(condition);

      expect(result).toEqual(mockExaminationScore);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: condition });
    });

    it('should return null when condition does not match', async () => {
      const condition = { courseId: 999, studentId: 999 };
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneByCondition(condition);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update examination score', async () => {
      const updatedScore = { ...mockExaminationScore, score: 95 };
      mockRepository.findOneBy.mockResolvedValue(mockExaminationScore);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValueOnce(mockExaminationScore);
      mockRepository.findOneBy.mockResolvedValueOnce(updatedScore);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedScore);
      expect(
        mockExaminationSubmitService.validateSubmitted,
      ).toHaveBeenCalledWith(
        mockExaminationScore.examinationId,
        mockExaminationScore.studentId,
      );
    });

    it('should throw error when score not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        'Examination score with id 999 not found',
      );
    });
  });

  describe('remove', () => {
    it('should delete examination score', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ affected: 1 });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return affected 0 when id not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result).toEqual({ affected: 0 });
    });
  });

  describe('findByExamination', () => {
    it('should return examination scores by examination id', async () => {
      const scores = [mockExaminationScore];
      mockRepository.findBy.mockResolvedValue(scores);

      const result = await service.findByExamination(1);

      expect(result).toEqual(scores);
      expect(mockRepository.findBy).toHaveBeenCalledWith({ examinationId: 1 });
    });

    it('should return empty array when no scores found for examination', async () => {
      mockRepository.findBy.mockResolvedValue([]);

      const result = await service.findByExamination(999);

      expect(result).toEqual([]);
    });
  });

  describe('findByStudent', () => {
    it('should return examination scores by student id', async () => {
      const scores = [mockExaminationScore];
      mockRepository.findBy.mockResolvedValue(scores);

      const result = await service.findByStudent(1);

      expect(result).toEqual(scores);
      expect(mockRepository.findBy).toHaveBeenCalledWith({ studentId: 1 });
    });

    it('should return empty array when no scores found for student', async () => {
      mockRepository.findBy.mockResolvedValue([]);

      const result = await service.findByStudent(999);

      expect(result).toEqual([]);
    });
  });

  describe('findCommon', () => {
    it('should return paginated results with default pagination', async () => {
      const scores = [mockExaminationScore];
      mockRepository.findAndCount.mockResolvedValue([scores, 1]);

      const result = await service.findCommon({});

      expect(result).toEqual([scores, 1]);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { id: 'DESC' },
      });
    });

    it('should return paginated results with custom pagination', async () => {
      const scores = [mockExaminationScore];
      mockRepository.findAndCount.mockResolvedValue([scores, 1]);

      const result = await service.findCommon({ page: 2, limit: 5 });

      expect(result).toEqual([scores, 1]);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 5,
        take: 5,
        order: { id: 'DESC' },
      });
    });

    it('should filter by examinationId', async () => {
      const scores = [mockExaminationScore];
      mockRepository.findAndCount.mockResolvedValue([scores, 1]);

      const result = await service.findCommon({ examinationId: 1 });

      expect(result).toEqual([scores, 1]);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { examinationId: 1 },
        skip: 0,
        take: 10,
        order: { id: 'DESC' },
      });
    });

    it('should filter by studentId', async () => {
      const scores = [mockExaminationScore];
      mockRepository.findAndCount.mockResolvedValue([scores, 1]);

      const result = await service.findCommon({ studentId: 1 });

      expect(result).toEqual([scores, 1]);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { studentId: 1 },
        skip: 0,
        take: 10,
        order: { id: 'DESC' },
      });
    });

    it('should filter by both examinationId and studentId', async () => {
      const scores = [mockExaminationScore];
      mockRepository.findAndCount.mockResolvedValue([scores, 1]);

      const result = await service.findCommon({
        examinationId: 1,
        studentId: 1,
      });

      expect(result).toEqual([scores, 1]);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { examinationId: 1, studentId: 1 },
        skip: 0,
        take: 10,
        order: { id: 'DESC' },
      });
    });
  });

  describe('upsert', () => {
    it('should update existing score on upsert', async () => {
      const existingScore = { ...mockExaminationScore, score: 80 };
      mockRepository.findOne.mockResolvedValue(existingScore);
      mockRepository.save.mockResolvedValue({ ...existingScore, score: 90 });

      const result = await service.upsert(createDto);

      expect(result.score).toBe(90);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should create new score on upsert when not exists', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockExaminationScore);
      mockRepository.save.mockResolvedValue(mockExaminationScore);

      const result = await service.upsert(createDto);

      expect(result).toEqual(mockExaminationScore);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findByCourse', () => {
    it('should return examination scores by course id', async () => {
      const scores = [mockExaminationScore];
      mockRepository.findBy.mockResolvedValue(scores);

      const result = await service.findByCourse(1);

      expect(result).toEqual(scores);
      expect(mockRepository.findBy).toHaveBeenCalledWith({ courseId: 1 });
    });
  });

  describe('findByCourseAndStudent', () => {
    it('should return examination scores by course and student id', async () => {
      const scores = [mockExaminationScore];
      mockRepository.findBy.mockResolvedValue(scores);

      const result = await service.findByCourseAndStudent(1, 1);

      expect(result).toEqual(scores);
      expect(mockRepository.findBy).toHaveBeenCalledWith({
        courseId: 1,
        studentId: 1,
      });
    });
  });
});
