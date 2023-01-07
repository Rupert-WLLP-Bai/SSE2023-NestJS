import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';
import { ExperimentController } from './experiment.controller';
import { ExperimentService } from './experiment.service';

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
      ],
    }).compile();

    controller = module.get<ExperimentController>(ExperimentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
