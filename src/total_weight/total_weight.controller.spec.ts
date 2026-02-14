import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TotalWeight } from './entities/total_weight.entity';
import { TotalWeightController } from './total_weight.controller';
import { TotalWeightService } from './total_weight.service';

describe('TotalWeightController', () => {
  let controller: TotalWeightController;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TotalWeightController],
      providers: [
        TotalWeightService,
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<TotalWeightController>(TotalWeightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
