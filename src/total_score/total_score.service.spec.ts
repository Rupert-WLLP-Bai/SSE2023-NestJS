import { Test, TestingModule } from '@nestjs/testing';
import { TotalScoreService } from './total_score.service';

describe('TotalScoreService', () => {
  let service: TotalScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TotalScoreService],
    }).compile();

    service = module.get<TotalScoreService>(TotalScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
