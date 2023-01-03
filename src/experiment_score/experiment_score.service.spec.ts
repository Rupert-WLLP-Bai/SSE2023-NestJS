import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentScoreService } from './experiment_score.service';

describe('ExperimentScoreService', () => {
  let service: ExperimentScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperimentScoreService],
    }).compile();

    service = module.get<ExperimentScoreService>(ExperimentScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
