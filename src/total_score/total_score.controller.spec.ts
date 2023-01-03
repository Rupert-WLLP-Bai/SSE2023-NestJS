import { Test, TestingModule } from '@nestjs/testing';
import { TotalScoreController } from './total_score.controller';
import { TotalScoreService } from './total_score.service';

describe('TotalScoreController', () => {
  let controller: TotalScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TotalScoreController],
      providers: [TotalScoreService],
    }).compile();

    controller = module.get<TotalScoreController>(TotalScoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
