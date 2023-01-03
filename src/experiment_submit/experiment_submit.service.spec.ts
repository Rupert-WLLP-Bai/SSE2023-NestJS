import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentSubmitService } from './experiment_submit.service';

describe('ExperimentSubmitService', () => {
  let service: ExperimentSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperimentSubmitService],
    }).compile();

    service = module.get<ExperimentSubmitService>(ExperimentSubmitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
