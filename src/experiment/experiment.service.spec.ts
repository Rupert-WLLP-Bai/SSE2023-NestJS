import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';
import { ExperimentService } from './experiment.service';

describe('ExperimentService', () => {
  let service: ExperimentService;
  let mockRepository: any;

  const mockExperiment = {
    id: 1,
    title: 'Lab 1',
    description: 'First lab',
    courseId: 1,
    classId: 1,
    deadline: new Date(),
    weight: 20,
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
        ExperimentService,
        {
          provide: getRepositoryToken(Experiment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExperimentService>(ExperimentService);
  });

  describe('create', () => {
    it('should create an experiment', async () => {
      mockRepository.save.mockResolvedValue(mockExperiment);
      const result = await service.create(mockExperiment as any);
      expect(result).toEqual(mockExperiment);
    });
  });

  describe('findAll', () => {
    it('should return all experiments', async () => {
      mockRepository.find.mockResolvedValue([mockExperiment]);
      const result = await service.findAll();
      expect(result).toEqual([mockExperiment]);
    });
  });

  describe('findOne', () => {
    it('should return experiment by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockExperiment);
      const result = await service.findOne(1);
      expect(result).toEqual(mockExperiment);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update experiment', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, mockExperiment as any);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete experiment', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findCommon', () => {
    it('should return paginated experiments', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockExperiment], 1]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      });
      expect(result).toEqual([[mockExperiment], 1]);
    });
  });
});
