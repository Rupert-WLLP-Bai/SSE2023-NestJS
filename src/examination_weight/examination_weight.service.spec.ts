import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationWeight } from './entities/examination_weight.entity';
import { ExaminationWeightService } from './examination_weight.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';

describe('ExaminationWeightService', () => {
  let service: ExaminationWeightService;
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
        ExaminationWeightService,
        {
          provide: getRepositoryToken(ExaminationWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExaminationWeightService>(ExaminationWeightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
