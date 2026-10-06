import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationController } from './examination.controller';
import { ExaminationService } from './examination.service';
import { ExaminationStatus } from './entities/examination.entity';

describe('ExaminationController', () => {
  let controller: ExaminationController;
  let mockService: any;

  const mockExamination = {
    id: 1,
    title: 'Math Exam',
    status: ExaminationStatus.NOT_STARTED,
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findPage: jest.fn(),
      findCommon: jest.fn(),
      start: jest.fn(),
      end: jest.fn(),
      archive: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationController],
      providers: [
        {
          provide: ExaminationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ExaminationController>(ExaminationController);
  });

  describe('create', () => {
    it('should create examination', async () => {
      mockService.create.mockResolvedValue(mockExamination);
      const result = await controller.create({ title: 'Math Exam' } as any);
      expect(result).toEqual(mockExamination);
    });
  });

  describe('findPage', () => {
    it('should return paginated results when page provided', async () => {
      mockService.findPage.mockResolvedValue([[mockExamination], 1]);
      const result = await controller.findPage(1, 10);
      expect(result.list).toEqual([mockExamination]);
      expect(result.total).toBe(1);
    });

    it('should return all results when page not provided', async () => {
      mockService.findAndCount.mockResolvedValue([[mockExamination], 1]);
      const result = await controller.findPage(undefined, undefined);
      expect(result.list).toEqual([mockExamination]);
    });
  });

  describe('findCommon', () => {
    it('should return common query results', async () => {
      mockService.findCommon.mockResolvedValue([[mockExamination], 1]);
      const result = await controller.findCommon({
        page: 1,
        limit: 10,
      } as any);
      expect(result.list).toEqual([mockExamination]);
    });
  });

  describe('findOne', () => {
    it('should return examination by id', async () => {
      mockService.findOne.mockResolvedValue(mockExamination);
      const result = await controller.findOne('1');
      expect(result.list).toEqual([mockExamination]);
    });

    it('should return list with null when not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      const result = await controller.findOne('999');
      expect(result.list).toEqual([null]);
    });
  });

  describe('update', () => {
    it('should update examination', async () => {
      mockService.update.mockResolvedValue({ affected: 1 });
      const result = await controller.update('1', { title: 'Updated' } as any);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete examination', async () => {
      mockService.remove.mockResolvedValue({ affected: 1 });
      await controller.remove('1');
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('start', () => {
    it('should start examination', async () => {
      mockService.start.mockResolvedValue({
        ...mockExamination,
        status: ExaminationStatus.IN_PROGRESS,
      });
      const result = await controller.start('1');
      expect(result.status).toBe(ExaminationStatus.IN_PROGRESS);
    });
  });

  describe('end', () => {
    it('should end examination', async () => {
      mockService.end.mockResolvedValue({
        ...mockExamination,
        status: ExaminationStatus.FINISHED,
      });
      const result = await controller.end('1');
      expect(result.status).toBe(ExaminationStatus.FINISHED);
    });
  });

  describe('archive', () => {
    it('should archive examination', async () => {
      mockService.archive.mockResolvedValue({
        ...mockExamination,
        status: ExaminationStatus.ARCHIVED,
      });
      const result = await controller.archive('1');
      expect(result.status).toBe(ExaminationStatus.ARCHIVED);
    });
  });
});
