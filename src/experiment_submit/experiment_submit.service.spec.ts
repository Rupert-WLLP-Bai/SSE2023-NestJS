import { ExperimentSubmit } from './entities/experiment_submit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentSubmitService } from './experiment_submit.service';

describe('ExperimentSubmitService', () => {
  let service: ExperimentSubmitService;
  let mockRepository: any;

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
    mockRepository = {
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
        ExperimentSubmitService,
        {
          provide: getRepositoryToken(ExperimentSubmit),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExperimentSubmitService>(ExperimentSubmitService);
  });

  describe('create', () => {
    it('should create an experiment submit', async () => {
      mockRepository.save.mockResolvedValue(mockSubmit);
      const result = await service.create(mockSubmit as any);
      expect(result).toEqual(mockSubmit);
    });
  });

  describe('findAll', () => {
    it('should return all experiment submits', async () => {
      const submits = [mockSubmit];
      mockRepository.find.mockResolvedValue(submits);
      const result = await service.findAll();
      expect(result).toEqual(submits);
    });
  });

  describe('findOne', () => {
    it('should return experiment submit by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockSubmit);
      const result = await service.findOne(1);
      expect(result).toEqual(mockSubmit);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update experiment submit', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, {} as any);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete experiment submit', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findCommon', () => {
    it('should return paginated experiment submits', async () => {
      const submits = [mockSubmit];
      mockRepository.findAndCount.mockResolvedValue([submits, 1]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      });
      expect(result).toEqual([submits, 1]);
    });

    it('should apply filter in query', async () => {
      const submits = [mockSubmit];
      mockRepository.findAndCount.mockResolvedValue([submits, 1]);
      await service.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'DESC',
        filter: { studentId: 1 },
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { id: 'DESC' },
        where: { studentId: 1 },
      });
    });
  });
});
