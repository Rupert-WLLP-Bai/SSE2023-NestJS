import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TotalScore } from './entities/total_score.entity';
import { TotalScoreService } from './total_score.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { ExperimentScore } from '../experiment_score/entities/experiment_score.entity';
import { ExperimentWeight } from '../experiment_weight/entities/experiment_weight.entity';
import { ExaminationScore } from '../examination_score/entities/examination_score.entity';
import { ExaminationWeight } from '../examination_weight/entities/examination_weight.entity';
import { EnrollmentService } from '../enrollment/enrollment.service';

describe('TotalScoreService', () => {
  let service: TotalScoreService;
  let mockRepository: any;
  let mockEnrollmentService: any;
  let mockDataSource: any;

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

    mockEnrollmentService = {
      findByCourseId: jest.fn().mockResolvedValue([]),
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          delete: jest.fn(),
          create: jest.fn(),
          save: jest.fn(),
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TotalScoreService,
        {
          provide: getRepositoryToken(TotalScore),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ExperimentScore),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ExperimentWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ExaminationScore),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ExaminationWeight),
          useValue: mockRepository,
        },
        {
          provide: EnrollmentService,
          useValue: mockEnrollmentService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TotalScoreService>(TotalScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
