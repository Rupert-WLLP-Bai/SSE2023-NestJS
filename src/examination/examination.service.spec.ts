import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationService } from './examination.service';

describe('ExaminationService', () => {
  let service: ExaminationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExaminationService],
    }).compile();

    service = module.get<ExaminationService>(ExaminationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
