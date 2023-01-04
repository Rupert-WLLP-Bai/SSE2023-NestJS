import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationScoreController } from './examination_score.controller';
import { ExaminationScoreService } from './examination_score.service';

describe('ExaminationScoreController', () => {
  let controller: ExaminationScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationScoreController],
      providers: [ExaminationScoreService],
    }).compile();

    controller = module.get<ExaminationScoreController>(
      ExaminationScoreController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
