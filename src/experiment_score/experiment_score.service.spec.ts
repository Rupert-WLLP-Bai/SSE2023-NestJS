import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperimentScore } from './entities/experiment_score.entity';
import { ExperimentScoreService } from './experiment_score.service';

describe('ExperimentScoreService', () => {
  let service: ExperimentScoreService;
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
        ExperimentScoreService,
        {
          provide: getRepositoryToken(ExperimentScore),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExperimentScoreService>(ExperimentScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
