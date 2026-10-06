import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ExaminationSubmit,
  SubmitStatus,
} from './entities/examination_submit.entity';
import { ExaminationSubmitController } from './examination_submit.controller';
import { ExaminationSubmitService } from './examination_submit.service';
import { ExaminationService } from '../examination/examination.service';
import {
  Examination,
  ExaminationStatus,
} from '../examination/entities/examination.entity';

describe('ExaminationSubmitController', () => {
  let controller: ExaminationSubmitController;
  let mockService: any;
  let mockRepository: any;

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
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByExamination: jest.fn(),
      findByStudent: jest.fn(),
      findByProblem: jest.fn(),
      findCommon: jest.fn(),
      validateSubmissionWindow: jest.fn(),
      createWithValidation: jest.fn(),
      validateSubmitted: jest.fn(),
      markAsGraded: jest.fn(),
    };

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

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationSubmitController],
      providers: [
        ExaminationSubmitService,
        {
          provide: getRepositoryToken(ExaminationSubmit),
          useValue: mockRepository,
        },
        {
          provide: ExaminationService,
          useValue: { findOne: jest.fn() },
        },
      ],
    })
      .overrideProvider(ExaminationSubmitService)
      .useValue(mockService)
      .compile();

    controller = module.get<ExaminationSubmitController>(
      ExaminationSubmitController,
    );
  });

  describe('create', () => {
    it('should create a new examination submit', async () => {
      const createDto = {
        examinationId: 1,
        studentId: 1,
        problemId: 1,
        answer: 'Test answer',
      };
      mockService.createWithValidation.mockResolvedValue(mockExaminationSubmit);

      const result = await controller.create(createDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockExaminationSubmit);
      expect(mockService.createWithValidation).toHaveBeenCalledWith(createDto);
    });

    it('should return error when creation fails', async () => {
      const createDto = {
        examinationId: 1,
        studentId: 1,
      };
      mockService.createWithValidation.mockRejectedValue(
        new Error('Validation failed'),
      );

      const result = await controller.create(createDto);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Validation failed');
    });
  });

  describe('findAll', () => {
    it('should return all examination submits', async () => {
      mockService.findAll.mockResolvedValue([mockExaminationSubmit]);

      const result = await controller.findAll();

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockExaminationSubmit]);
      expect(result.data.total).toBe(1);
    });

    it('should return empty list when no submits', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
      expect(result.data.total).toBe(0);
    });

    it('should handle error', async () => {
      mockService.findAll.mockRejectedValue(new Error('Database error'));

      const result = await controller.findAll();

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Database error');
    });
  });

  describe('findOne', () => {
    it('should return examination submit by id', async () => {
      mockService.findOne.mockResolvedValue(mockExaminationSubmit);

      const result = await controller.findOne(1);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockExaminationSubmit]);
      expect(result.data.total).toBe(1);
    });

    it('should return empty list when not found', async () => {
      mockService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
      expect(result.data.total).toBe(0);
    });

    it('should handle error', async () => {
      mockService.findOne.mockRejectedValue(new Error('Not found'));

      const result = await controller.findOne(1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Not found');
    });
  });

  describe('update', () => {
    it('should update examination submit', async () => {
      const updateDto = { score: 90, feedback: 'Good job!' };
      mockService.update.mockResolvedValue({
        ...mockExaminationSubmit,
        ...updateDto,
      });

      const result = await controller.update(1, updateDto);

      expect(result.success).toBe(true);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should handle update error', async () => {
      mockService.update.mockRejectedValue(new Error('Update failed'));

      const result = await controller.update(1, { score: 90 });

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Update failed');
    });
  });

  describe('remove', () => {
    it('should delete examination submit', async () => {
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

  describe('markAsGraded', () => {
    it('should mark submission as graded', async () => {
      mockService.validateSubmitted.mockResolvedValue(undefined);
      mockService.markAsGraded.mockResolvedValue({
        ...mockExaminationSubmit,
        status: SubmitStatus.GRADED,
      });

      const result = await controller.markAsGraded(1, 1, 1);

      expect(result.success).toBe(true);
      expect(mockService.validateSubmitted).toHaveBeenCalledWith(1, 1, 1);
      expect(mockService.markAsGraded).toHaveBeenCalledWith(1, 1, 1);
    });

    it('should return error when validation fails', async () => {
      mockService.validateSubmitted.mockRejectedValue(
        new Error('No submission found'),
      );

      const result = await controller.markAsGraded(1, 1, 1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('No submission found');
    });

    it('should return error when marking as graded fails', async () => {
      mockService.validateSubmitted.mockResolvedValue(undefined);
      mockService.markAsGraded.mockRejectedValue(new Error('Update failed'));

      const result = await controller.markAsGraded(1, 1, 1);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Update failed');
    });
  });

  describe('findCommon', () => {
    it('should return paginated results', async () => {
      const query = { page: 1, limit: 10, examinationId: 1 };
      mockService.findCommon.mockResolvedValue([[mockExaminationSubmit], 1]);

      const result = await controller.findCommon(query);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockExaminationSubmit]);
      expect(result.data.total).toBe(1);
      expect(result.data.current).toBe(1);
      expect(result.data.pageSize).toBe(10);
    });

    it('should use default pagination values', async () => {
      const query = {};
      mockService.findCommon.mockResolvedValue([[], 0]);

      const result = await controller.findCommon(query);

      expect(result.success).toBe(true);
      expect(result.data.current).toBe(1);
      expect(result.data.pageSize).toBe(10);
    });

    it('should handle custom page and limit', async () => {
      const query = { page: 2, limit: 20, studentId: 1 };
      mockService.findCommon.mockResolvedValue([[], 0]);

      const result = await controller.findCommon(query);

      expect(result.success).toBe(true);
      expect(result.data.current).toBe(2);
      expect(result.data.pageSize).toBe(20);
    });

    it('should handle error', async () => {
      mockService.findCommon.mockRejectedValue(new Error('Query failed'));

      const result = await controller.findCommon({});

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Query failed');
    });
  });
});
