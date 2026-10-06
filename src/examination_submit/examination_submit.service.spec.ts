import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import {
  ExaminationSubmit,
  SubmitStatus,
} from './entities/examination_submit.entity';
import { ExaminationSubmitService } from './examination_submit.service';
import { ExaminationService } from '../examination/examination.service';
import {
  Examination,
  ExaminationStatus,
} from '../examination/entities/examination.entity';

describe('ExaminationSubmitService', () => {
  let service: ExaminationSubmitService;
  let mockRepository: any;
  let mockExaminationService: any;

  const mockExaminationSubmit = {
    id: 1,
    examinationId: 1,
    studentId: 1,
    problemId: 1,
    answer: 'Test answer',
    fileUrl: 'https://example.com/file.pdf',
    status: SubmitStatus.SUBMITTED,
    score: null,
    feedback: null,
    submitTime: new Date(),
    createTime: new Date(),
    updateTime: new Date(),
  };

  const mockExamination = {
    id: 1,
    title: 'Math Exam',
    startTime: new Date(Date.now() - 3600000),
    endTime: new Date(Date.now() + 3600000),
    status: ExaminationStatus.IN_PROGRESS,
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

    mockExaminationService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationSubmitService,
        {
          provide: getRepositoryToken(ExaminationSubmit),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Examination),
          useValue: mockRepository,
        },
        {
          provide: ExaminationService,
          useValue: mockExaminationService,
        },
      ],
    }).compile();

    service = module.get<ExaminationSubmitService>(ExaminationSubmitService);
  });

  describe('create', () => {
    it('should create an examination submit', async () => {
      mockRepository.create.mockReturnValue(mockExaminationSubmit);
      mockRepository.save.mockResolvedValue(mockExaminationSubmit);
      const result = await service.create({
        examinationId: 1,
        studentId: 1,
        problemId: 1,
      });
      expect(result).toEqual(mockExaminationSubmit);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should create with all fields', async () => {
      const fullDto = {
        examinationId: 1,
        studentId: 1,
        problemId: 1,
        answer: 'Test answer',
        fileUrl: 'https://example.com/file.pdf',
      };
      mockRepository.create.mockReturnValue(fullDto);
      mockRepository.save.mockResolvedValue(fullDto);
      const result = await service.create(fullDto);
      expect(result).toEqual(fullDto);
    });
  });

  describe('findAll', () => {
    it('should return all examination submits', async () => {
      mockRepository.find.mockResolvedValue([mockExaminationSubmit]);
      const result = await service.findAll();
      expect(result).toEqual([mockExaminationSubmit]);
    });

    it('should return empty array when no submits exist', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return examination submit by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockExaminationSubmit);
      const result = await service.findOne(1);
      expect(result).toEqual(mockExaminationSubmit);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update examination submit', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue({
        ...mockExaminationSubmit,
        score: 90,
      });
      const result = await service.update(1, { score: 90 } as any);
      expect(result).toBeDefined();
      expect(mockRepository.update).toHaveBeenCalledWith(1, { score: 90 });
    });

    it('should update with feedback', async () => {
      const updateDto = { score: 85, feedback: 'Good job!' };
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue({
        ...mockExaminationSubmit,
        ...updateDto,
      });
      const result = await service.update(1, updateDto as any);
      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should delete examination submit', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should handle delete with no affected rows', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });
      const result = await service.remove(999);
      expect(result).toEqual({ affected: 0 });
    });
  });

  describe('findByExamination', () => {
    it('should return examination submits by examination id', async () => {
      mockRepository.findBy.mockResolvedValue([mockExaminationSubmit]);
      const result = await service.findByExamination(1);
      expect(result).toEqual([mockExaminationSubmit]);
      expect(mockRepository.findBy).toHaveBeenCalledWith({ examinationId: 1 });
    });

    it('should return empty array when no submits for examination', async () => {
      mockRepository.findBy.mockResolvedValue([]);
      const result = await service.findByExamination(999);
      expect(result).toEqual([]);
    });
  });

  describe('findByStudent', () => {
    it('should return examination submits by student id', async () => {
      mockRepository.findBy.mockResolvedValue([mockExaminationSubmit]);
      const result = await service.findByStudent(1);
      expect(result).toEqual([mockExaminationSubmit]);
      expect(mockRepository.findBy).toHaveBeenCalledWith({ studentId: 1 });
    });

    it('should return empty array when no submits for student', async () => {
      mockRepository.findBy.mockResolvedValue([]);
      const result = await service.findByStudent(999);
      expect(result).toEqual([]);
    });
  });

  describe('findByProblem', () => {
    it('should return examination submits by problem id', async () => {
      mockRepository.findBy.mockResolvedValue([mockExaminationSubmit]);
      const result = await service.findByProblem(1);
      expect(result).toEqual([mockExaminationSubmit]);
      expect(mockRepository.findBy).toHaveBeenCalledWith({ problemId: 1 });
    });

    it('should return empty array when no submits for problem', async () => {
      mockRepository.findBy.mockResolvedValue([]);
      const result = await service.findByProblem(999);
      expect(result).toEqual([]);
    });
  });

  describe('findCommon', () => {
    it('should return paginated results', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [mockExaminationSubmit],
        1,
      ]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        examinationId: 1,
      });
      expect(result).toEqual([[mockExaminationSubmit], 1]);
    });

    it('should apply default pagination', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);
      const result = await service.findCommon({});
      expect(result).toEqual([[], 0]);
    });

    it('should filter by studentId', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [mockExaminationSubmit],
        1,
      ]);
      await service.findCommon({ studentId: 1 });
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter by problemId', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [mockExaminationSubmit],
        1,
      ]);
      await service.findCommon({ problemId: 1 });
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filter by status', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [mockExaminationSubmit],
        1,
      ]);
      await service.findCommon({ status: SubmitStatus.SUBMITTED });
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });

    it('should handle custom filters', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [mockExaminationSubmit],
        1,
      ]);
      await service.findCommon({ page: 2, limit: 20 });
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('validateSubmissionWindow', () => {
    it('should not throw when within submission window', async () => {
      mockExaminationService.findOne.mockResolvedValue(mockExamination);
      await expect(service.validateSubmissionWindow(1)).resolves.not.toThrow();
    });

    it('should throw when examination not found', async () => {
      mockExaminationService.findOne.mockResolvedValue(null);
      await expect(service.validateSubmissionWindow(999)).rejects.toThrow(
        'Examination with id 999 not found',
      );
    });

    it('should throw when examination status is NOT_STARTED', async () => {
      const examination = {
        ...mockExamination,
        status: ExaminationStatus.NOT_STARTED,
        startTime: new Date(Date.now() + 3600000),
        endTime: new Date(Date.now() + 7200000),
      };
      mockExaminationService.findOne.mockResolvedValue(examination);
      await expect(service.validateSubmissionWindow(1)).rejects.toThrow();
    });

    it('should throw when examination status is FINISHED', async () => {
      const examination = {
        ...mockExamination,
        status: ExaminationStatus.FINISHED,
      };
      mockExaminationService.findOne.mockResolvedValue(examination);
      await expect(service.validateSubmissionWindow(1)).rejects.toThrow(
        'examination status is FINISHED',
      );
    });

    it('should throw when examination status is ARCHIVED', async () => {
      const examination = {
        ...mockExamination,
        status: ExaminationStatus.ARCHIVED,
      };
      mockExaminationService.findOne.mockResolvedValue(examination);
      await expect(service.validateSubmissionWindow(1)).rejects.toThrow(
        'examination status is ARCHIVED',
      );
    });

    it('should throw when examination has not started yet', async () => {
      const examination = {
        ...mockExamination,
        status: ExaminationStatus.IN_PROGRESS,
        startTime: new Date(Date.now() + 3600000),
        endTime: new Date(Date.now() + 7200000),
      };
      mockExaminationService.findOne.mockResolvedValue(examination);
      await expect(service.validateSubmissionWindow(1)).rejects.toThrow(
        'examination has not started yet',
      );
    });

    it('should throw when examination has ended', async () => {
      const examination = {
        ...mockExamination,
        status: ExaminationStatus.IN_PROGRESS,
        startTime: new Date(Date.now() - 7200000),
        endTime: new Date(Date.now() - 3600000),
      };
      mockExaminationService.findOne.mockResolvedValue(examination);
      await expect(service.validateSubmissionWindow(1)).rejects.toThrow(
        'examination has ended',
      );
    });
  });

  describe('createWithValidation', () => {
    it('should create submission with validation', async () => {
      mockExaminationService.findOne.mockResolvedValue(mockExamination);
      const createDto = {
        examinationId: 1,
        studentId: 1,
        problemId: 1,
        answer: 'Test answer',
      };
      const expectedSubmit = {
        ...createDto,
        status: SubmitStatus.SUBMITTED,
        submitTime: expect.any(Date),
      };
      mockRepository.create.mockReturnValue(expectedSubmit);
      mockRepository.save.mockResolvedValue(expectedSubmit);

      const result = await service.createWithValidation(createDto);

      expect(result).toBeDefined();
      expect(mockExaminationService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw when validation fails', async () => {
      mockExaminationService.findOne.mockResolvedValue(null);
      await expect(
        service.createWithValidation({
          examinationId: 999,
          studentId: 1,
        }),
      ).rejects.toThrow();
    });
  });

  describe('validateSubmitted', () => {
    it('should not throw when submission exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockExaminationSubmit);
      await expect(service.validateSubmitted(1, 1, 1)).resolves.not.toThrow();
    });

    it('should throw when submission not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.validateSubmitted(1, 1, 1)).rejects.toThrow(
        'no submission found',
      );
    });

    it('should throw when status is NOT_SUBMITTED', async () => {
      mockRepository.findOne.mockResolvedValue({
        ...mockExaminationSubmit,
        status: SubmitStatus.NOT_SUBMITTED,
      });
      await expect(service.validateSubmitted(1, 1, 1)).rejects.toThrow(
        'submission not yet made',
      );
    });

    it('should validate without problemId', async () => {
      mockRepository.findOne.mockResolvedValue(mockExaminationSubmit);
      await expect(service.validateSubmitted(1, 1)).resolves.not.toThrow();
    });
  });

  describe('markAsGraded', () => {
    it('should mark single submission as graded', async () => {
      mockRepository.findOne.mockResolvedValue(mockExaminationSubmit);
      const gradedSubmit = {
        ...mockExaminationSubmit,
        status: SubmitStatus.GRADED,
      };
      mockRepository.save.mockResolvedValue(gradedSubmit);

      const result = await service.markAsGraded(1, 1, 1);

      expect(result).toBeDefined();
      expect((result as any).status).toBe(SubmitStatus.GRADED);
    });

    it('should throw when submission not found for markAsGraded', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.markAsGraded(1, 1, 1)).rejects.toThrow(
        'Submission not found',
      );
    });

    it('should mark all submissions for student when problemId not provided', async () => {
      const submissions = [
        { ...mockExaminationSubmit, id: 1 },
        { ...mockExaminationSubmit, id: 2 },
      ];
      mockRepository.find.mockResolvedValue(submissions);
      mockRepository.save.mockImplementation((entities) =>
        Promise.resolve(entities),
      );

      const result = await service.markAsGraded(1, 1);

      expect(result).toHaveLength(2);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw when no submissions found for student', async () => {
      mockRepository.find.mockResolvedValue([]);
      await expect(service.markAsGraded(1, 1)).rejects.toThrow(
        'No submissions found',
      );
    });
  });
});
