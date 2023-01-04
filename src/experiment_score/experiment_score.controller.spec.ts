import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentScoreController } from './experiment_score.controller';
import { ExperimentScoreService } from './experiment_score.service';

describe('ExperimentScoreController', () => {
  let controller: ExperimentScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentScoreController],
      providers: [ExperimentScoreService],
    }).compile();

    controller = module.get<ExperimentScoreController>(
      ExperimentScoreController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
