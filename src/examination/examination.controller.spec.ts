import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationController } from './examination.controller';
import { ExaminationService } from './examination.service';

describe('ExaminationController', () => {
  let controller: ExaminationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationController],
      providers: [ExaminationService],
    }).compile();

    controller = module.get<ExaminationController>(ExaminationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
