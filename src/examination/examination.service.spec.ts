import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Examination, ExaminationStatus } from './entities/examination.entity';
import { ExaminationService } from './examination.service';

describe('ExaminationService', () => {
  let service: ExaminationService;
  let mockRepository: any;

  const mockExamination = {
    id: 1,
    title: 'Math Exam',
    description: 'Final exam',
    courseId: 1,
    classId: 1,
    startTime: new Date(),
    endTime: new Date(),
    duration: 120,
    totalScore: 100,
    status: ExaminationStatus.NOT_STARTED,
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationService,
        {
          provide: getRepositoryToken(Examination),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExaminationService>(ExaminationService);
  });

  describe('create', () => {
    it('should create an examination', async () => {
      mockRepository.create.mockReturnValue(mockExamination);
      mockRepository.save.mockResolvedValue(mockExamination);
      const result = await service.create({
        title: 'Math Exam',
        courseId: 1,
      } as any);
      expect(result).toEqual(mockExamination);
    });
  });

  describe('findAll', () => {
    it('should return all examinations', async () => {
      mockRepository.find.mockResolvedValue([mockExamination]);
      const result = await service.findAll();
      expect(result).toEqual([mockExamination]);
    });
  });

  describe('findAndCount', () => {
    it('should return examinations with count', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockExamination], 1]);
      const result = await service.findAndCount();
      expect(result).toEqual([[mockExamination], 1]);
    });
  });

  describe('findOne', () => {
    it('should return examination by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockExamination);
      const result = await service.findOne(1);
      expect(result).toEqual(mockExamination);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update examination', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, { title: 'Updated Exam' } as any);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete examination', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findPage', () => {
    it('should return paginated examinations', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockExamination], 1]);
      const result = await service.findPage(1, 10);
      expect(result).toEqual([[mockExamination], 1]);
    });
  });

  describe('findCommon', () => {
    it('should return examinations with filter and pagination', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockExamination], 1]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: { courseId: 1 },
      });
      expect(result).toEqual([[mockExamination], 1]);
    });

    it('should use default sort when not provided', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockExamination], 1]);
      await service.findCommon({
        page: 1,
        limit: 10,
        filter: {},
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { id: 'DESC' },
        where: {},
      });
    });
  });

  describe('start', () => {
    it('should start examination successfully', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockExamination);
      mockRepository.save.mockResolvedValue({
        ...mockExamination,
        status: ExaminationStatus.IN_PROGRESS,
      });
      const result = await service.start(1);
      expect(result.status).toBe(ExaminationStatus.IN_PROGRESS);
    });

    it('should throw error when examination not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.start(999)).rejects.toThrow();
    });

    it('should throw error for invalid transition', async () => {
      mockRepository.findOneBy.mockResolvedValue({
        ...mockExamination,
        status: ExaminationStatus.FINISHED,
      });
      await expect(service.start(1)).rejects.toThrow();
    });
  });

  describe('end', () => {
    it('should end examination successfully', async () => {
      mockRepository.findOneBy.mockResolvedValue({
        ...mockExamination,
        status: ExaminationStatus.IN_PROGRESS,
      });
      mockRepository.save.mockResolvedValue({
        ...mockExamination,
        status: ExaminationStatus.FINISHED,
      });
      const result = await service.end(1);
      expect(result.status).toBe(ExaminationStatus.FINISHED);
    });

    it('should throw error when examination not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.end(999)).rejects.toThrow();
    });
  });

  describe('archive', () => {
    it('should archive examination successfully', async () => {
      mockRepository.findOneBy.mockResolvedValue({
        ...mockExamination,
        status: ExaminationStatus.FINISHED,
      });
      mockRepository.save.mockResolvedValue({
        ...mockExamination,
        status: ExaminationStatus.ARCHIVED,
      });
      const result = await service.archive(1);
      expect(result.status).toBe(ExaminationStatus.ARCHIVED);
    });

    it('should throw error when examination not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.archive(999)).rejects.toThrow();
    });
  });
});
