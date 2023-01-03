import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationSubmitService } from './examination_submit.service';

describe('ExaminationSubmitService', () => {
  let service: ExaminationSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExaminationSubmitService],
    }).compile();

    service = module.get<ExaminationSubmitService>(ExaminationSubmitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
