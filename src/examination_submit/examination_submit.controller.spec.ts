import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationSubmitController } from './examination_submit.controller';
import { ExaminationSubmitService } from './examination_submit.service';

describe('ExaminationSubmitController', () => {
  let controller: ExaminationSubmitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationSubmitController],
      providers: [ExaminationSubmitService],
    }).compile();

    controller = module.get<ExaminationSubmitController>(ExaminationSubmitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
