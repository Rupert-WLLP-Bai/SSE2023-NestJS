import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';
import { ExperimentService } from './experiment.service';

describe('ExperimentService', () => {
  let service: ExperimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentService,
        {
          provide: getRepositoryToken(Experiment),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ExperimentService>(ExperimentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
