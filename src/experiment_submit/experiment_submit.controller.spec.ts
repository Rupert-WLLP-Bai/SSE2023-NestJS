import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentSubmitController } from './experiment_submit.controller';
import { ExperimentSubmitService } from './experiment_submit.service';

describe('ExperimentSubmitController', () => {
  let controller: ExperimentSubmitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentSubmitController],
      providers: [ExperimentSubmitService],
    }).compile();

    controller = module.get<ExperimentSubmitController>(ExperimentSubmitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
