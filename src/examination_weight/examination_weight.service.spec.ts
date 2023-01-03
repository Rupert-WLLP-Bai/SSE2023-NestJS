import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationWeightService } from './examination_weight.service';

describe('ExaminationWeightService', () => {
  let service: ExaminationWeightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExaminationWeightService],
    }).compile();

    service = module.get<ExaminationWeightService>(ExaminationWeightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
