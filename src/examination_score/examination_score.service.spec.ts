import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationScoreService } from './examination_score.service';

describe('ExaminationScoreService', () => {
  let service: ExaminationScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExaminationScoreService],
    }).compile();

    service = module.get<ExaminationScoreService>(ExaminationScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
