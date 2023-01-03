import { Test, TestingModule } from '@nestjs/testing';
import { TotalWeightService } from './total_weight.service';

describe('TotalWeightService', () => {
  let service: TotalWeightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TotalWeightService],
    }).compile();

    service = module.get<TotalWeightService>(TotalWeightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
