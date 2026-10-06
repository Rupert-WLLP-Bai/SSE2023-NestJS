import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentSubmitController } from './experiment_submit.controller';
import { ExperimentSubmitService } from './experiment_submit.service';

describe('ExperimentSubmitController', () => {
  let controller: ExperimentSubmitController;
  let mockService: any;

  const mockSubmit = {
    id: 1,
    studentId: 1,
    experimentId: 1,
    fileUrl: 'http://example.com/file.pdf',
    timeStamp: new Date(),
    fileName: 'test.pdf',
    fileSize: 1024,
    mineType: 'application/pdf',
    fieldname: 'file',
    encoding: '7bit',
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

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentSubmitController],
      providers: [
        {
          provide: ExperimentSubmitService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ExperimentSubmitController>(ExperimentSubmitController);
  });

  describe('create', () => {
    it('should create experiment submit successfully with file', async () => {
      mockService.create.mockResolvedValue(mockSubmit);
      const mockFile = {
        originalname: 'test.pdf',
        size: 1024,
        mimetype: 'application/pdf',
        fieldname: 'file',
        encoding: '7bit',
      };
      const result = await controller.create({} as any, mockFile as any);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSubmit);
    });

    it('should fail when file is not provided', async () => {
      const result = await controller.create({} as any, null as any);
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('上传文件不能为空');
    });

    it('should handle error when creating', async () => {
      mockService.create.mockRejectedValue(new Error('Database error'));
      const mockFile = {
        originalname: 'test.pdf',
        size: 1024,
        mimetype: 'application/pdf',
        fieldname: 'file',
        encoding: '7bit',
      };
      const result = await controller.create({} as any, mockFile as any);
      expect(result.success).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return all experiment submits', async () => {
      mockService.findAll.mockResolvedValue([mockSubmit]);
      const result = await controller.findAll();
      expect(result.success).toBe(true);
      expect(result.data.list.length).toBe(1);
      expect(result.data.total).toBe(1);
    });

    it('should handle error when finding all', async () => {
      mockService.findAll.mockRejectedValue(new Error('Database error'));
      const result = await controller.findAll();
      expect(result.success).toBe(false);
    });
  });

  describe('findOne', () => {
    it('should return experiment submit by id', async () => {
      mockService.findOne.mockResolvedValue(mockSubmit);
      const result = await controller.findOne('1');
      expect(result.success).toBe(true);
      expect(result.data.list.length).toBe(1);
    });

    it('should return empty list when not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      const result = await controller.findOne('999');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
    });

    it('should handle error', async () => {
      mockService.findOne.mockRejectedValue(new Error('Database error'));
      const result = await controller.findOne('1');
      expect(result.success).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete experiment submit successfully', async () => {
      mockService.remove.mockResolvedValue({ affected: 1 });
      const result = await controller.remove('1');
      expect(result.success).toBe(true);
    });

    it('should handle error when deleting', async () => {
      mockService.remove.mockRejectedValue(new Error('Database error'));
      const result = await controller.remove('1');
      expect(result.success).toBe(false);
    });
  });
});
