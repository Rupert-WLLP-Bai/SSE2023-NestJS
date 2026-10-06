import { ExperimentSubmitService } from './../experiment_submit/experiment_submit.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';
import { ExperimentController } from './experiment.controller';
import { ExperimentService } from './experiment.service';
import { ExperimentSubmit } from '../experiment_submit/entities/experiment_submit.entity';
import { NotFoundException } from '@nestjs/common';

describe('ExperimentController', () => {
  let controller: ExperimentController;
  let mockService: any;
  let mockSubmitService: any;

  const mockExperiment = {
    id: 1,
    title: 'Lab 1',
    description: 'First lab',
    courseId: 1,
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findCommon: jest.fn(),
    };

    mockSubmitService = {
      find: jest.fn(),
      findCommon: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentController],
      providers: [
        {
          provide: ExperimentService,
          useValue: mockService,
        },
        {
          provide: ExperimentSubmitService,
          useValue: mockSubmitService,
        },
        {
          provide: getRepositoryToken(Experiment),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ExperimentSubmit),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ExperimentController>(ExperimentController);
  });

  describe('create', () => {
    it('should create experiment', async () => {
      mockService.create.mockResolvedValue(mockExperiment);
      const result = (await controller.create({} as any)) as any;
      expect(result.success).toBe(true);
    });

    it('should handle create error', async () => {
      mockService.create.mockRejectedValue(new Error('Create failed'));
      const result = (await controller.create({} as any)) as any;
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Create failed');
    });
  });

  describe('findAll', () => {
    it('should return all experiments', async () => {
      mockService.findAll.mockResolvedValue([mockExperiment]);
      const result = (await controller.findAll()) as any;
      expect(result.data.list).toEqual([mockExperiment]);
    });

    it('should handle findAll error', async () => {
      mockService.findAll.mockRejectedValue(new Error('Find all failed'));
      const result = (await controller.findAll()) as any;
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Find all failed');
    });

    it('should return correct total count', async () => {
      mockService.findAll.mockResolvedValue([mockExperiment, mockExperiment]);
      const result = (await controller.findAll()) as any;
      expect(result.data.total).toBe(2);
    });

    it('should return empty list when no experiments', async () => {
      mockService.findAll.mockResolvedValue([]);
      const result = (await controller.findAll()) as any;
      expect(result.data.list).toEqual([]);
      expect(result.data.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return experiment by id', async () => {
      mockService.findOne.mockResolvedValue(mockExperiment);
      const result = (await controller.findOne('1')) as any;
      expect(result.data.list).toEqual([mockExperiment]);
    });

    it('should return empty list when not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      const result = (await controller.findOne('999')) as any;
      expect(result.data.list).toEqual([]);
    });

    it('should handle findOne error', async () => {
      mockService.findOne.mockRejectedValue(new Error('Find one failed'));
      const result = (await controller.findOne('1')) as any;
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Find one failed');
    });

    it('should return correct total for single experiment', async () => {
      mockService.findOne.mockResolvedValue(mockExperiment);
      const result = (await controller.findOne('1')) as any;
      expect(result.data.total).toBe(1);
    });
  });

  describe('update', () => {
    it('should update experiment', async () => {
      mockService.update.mockResolvedValue({ affected: 1 });
      const result = (await controller.update('1', {} as any)) as any;
      expect(result.success).toBe(true);
    });

    it('should handle update error', async () => {
      mockService.update.mockRejectedValue(new Error('Update failed'));
      const result = (await controller.update('1', {} as any)) as any;
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Update failed');
    });
  });

  describe('remove', () => {
    it('should delete experiment', async () => {
      mockService.remove.mockResolvedValue({ affected: 1 });
      const result = (await controller.remove('1')) as any;
      expect(result.success).toBe(true);
    });

    it('should handle remove error', async () => {
      mockService.remove.mockRejectedValue(new Error('Remove failed'));
      const result = (await controller.remove('1')) as any;
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Remove failed');
    });
  });

  describe('findCommon', () => {
    it('should return paginated experiments', async () => {
      mockService.findCommon.mockResolvedValue([[mockExperiment], 1]);
      const result = (await controller.findCommon({} as any)) as any;
      expect(result.data.list).toEqual([mockExperiment]);
    });

    it('should handle findCommon error', async () => {
      mockService.findCommon.mockRejectedValue(new Error('Query failed'));
      const result = (await controller.findCommon({} as any)) as any;
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Query failed');
    });

    it('should return correct pagination data', async () => {
      mockService.findCommon.mockResolvedValue([[mockExperiment], 1]);
      const queryDto = { page: 2, limit: 10 };
      const result = (await controller.findCommon(queryDto as any)) as any;
      expect(result.data.current).toBe(2);
      expect(result.data.pageSize).toBe(10);
    });
  });

  describe('findSubmit', () => {
    it('should return file when found', async () => {
      const mockFile = Buffer.from('test file content');
      const mockSubmitResult = [[{ file: mockFile, fileName: 'test.txt' }], 1];
      mockSubmitService.findCommon.mockResolvedValue(mockSubmitResult);

      const mockRes = {
        set: jest.fn(),
        send: jest.fn(),
      };

      await controller.findSubmit('1', '2052526', mockRes);

      expect(mockRes.set).toHaveBeenCalledWith(
        'Content-Type',
        'application/octet-stream',
      );
      expect(mockRes.set).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=test.txt',
      );
      expect(mockRes.send).toHaveBeenCalledWith(mockFile);
    });

    it('should throw NotFoundException when file not found', async () => {
      mockSubmitService.findCommon.mockResolvedValue([[], 0]);

      const mockRes = {
        set: jest.fn(),
        send: jest.fn(),
      };

      await expect(
        controller.findSubmit('1', '2052526', mockRes),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when result is empty', async () => {
      // Return array with empty first element [[], count]
      mockSubmitService.findCommon.mockResolvedValue([[], 0]);

      const mockRes = {
        set: jest.fn(),
        send: jest.fn(),
      };

      await expect(
        controller.findSubmit('1', '2052526', mockRes),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
