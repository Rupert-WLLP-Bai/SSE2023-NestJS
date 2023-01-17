import { ExperimentSubmitService } from './../experiment_submit/experiment_submit.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';
import { ExperimentController } from './experiment.controller';
import { ExperimentService } from './experiment.service';
import { ExperimentSubmit } from '../experiment_submit/entities/experiment_submit.entity';

describe('ExperimentController', () => {
  let controller: ExperimentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentController],
      providers: [
        ExperimentService,
        {
          provide: getRepositoryToken(Experiment),
          useValue: {},
        },
        ExperimentSubmitService,
        {
          provide: getRepositoryToken(ExperimentSubmit),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ExperimentController>(ExperimentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
