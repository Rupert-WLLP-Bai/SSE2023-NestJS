import { Test, TestingModule } from '@nestjs/testing';
import { TotalWeightController } from './total_weight.controller';
import { TotalWeightService } from './total_weight.service';

describe('TotalWeightController', () => {
  let controller: TotalWeightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TotalWeightController],
      providers: [TotalWeightService],
    }).compile();

    controller = module.get<TotalWeightController>(TotalWeightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
