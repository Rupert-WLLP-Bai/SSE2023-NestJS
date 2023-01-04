import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationWeightController } from './examination_weight.controller';
import { ExaminationWeightService } from './examination_weight.service';

describe('ExaminationWeightController', () => {
  let controller: ExaminationWeightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationWeightController],
      providers: [ExaminationWeightService],
    }).compile();

    controller = module.get<ExaminationWeightController>(
      ExaminationWeightController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
