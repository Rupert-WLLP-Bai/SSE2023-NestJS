import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperimentSubmit } from './entities/experiment_submit.entity';
import { ExperimentSubmitController } from './experiment_submit.controller';
import { ExperimentSubmitService } from './experiment_submit.service';

describe('ExperimentSubmitController', () => {
  let controller: ExperimentSubmitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentSubmitController],
      providers: [
        ExperimentSubmitService,
        {
          provide: getRepositoryToken(ExperimentSubmit),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ExperimentSubmitController>(
      ExperimentSubmitController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
