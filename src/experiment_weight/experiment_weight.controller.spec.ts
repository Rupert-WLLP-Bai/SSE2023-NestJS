import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentWeightController } from './experiment_weight.controller';
import { ExperimentWeightService } from './experiment_weight.service';

describe('ExperimentWeightController', () => {
  let controller: ExperimentWeightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentWeightController],
      providers: [ExperimentWeightService],
    }).compile();

    controller = module.get<ExperimentWeightController>(
      ExperimentWeightController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
