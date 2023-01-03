import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentWeightService } from './experiment_weight.service';

describe('ExperimentWeightService', () => {
  let service: ExperimentWeightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperimentWeightService],
    }).compile();

    service = module.get<ExperimentWeightService>(ExperimentWeightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
