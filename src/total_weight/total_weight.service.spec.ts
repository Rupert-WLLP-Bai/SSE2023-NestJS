import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TotalWeight } from './entities/total_weight.entity';
import { TotalWeightService } from './total_weight.service';

describe('TotalWeightService', () => {
  let service: TotalWeightService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TotalWeightService,
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TotalWeightService>(TotalWeightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
