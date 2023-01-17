import { ExperimentSubmit } from './entities/experiment_submit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentSubmitService } from './experiment_submit.service';

describe('ExperimentSubmitService', () => {
  let service: ExperimentSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentSubmitService,
        {
          provide: getRepositoryToken(ExperimentSubmit),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ExperimentSubmitService>(ExperimentSubmitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
