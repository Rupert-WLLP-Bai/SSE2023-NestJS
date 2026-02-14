import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperimentWeight } from './entities/experiment_weight.entity';
import { ExperimentWeightService } from './experiment_weight.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';

describe('ExperimentWeightService', () => {
  let service: ExperimentWeightService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentWeightService,
        {
          provide: getRepositoryToken(ExperimentWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExperimentWeightService>(ExperimentWeightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
