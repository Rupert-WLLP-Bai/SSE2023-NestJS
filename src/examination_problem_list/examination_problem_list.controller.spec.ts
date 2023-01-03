import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationProblemListController } from './examination_problem_list.controller';
import { ExaminationProblemListService } from './examination_problem_list.service';

describe('ExaminationProblemListController', () => {
  let controller: ExaminationProblemListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationProblemListController],
      providers: [ExaminationProblemListService],
    }).compile();

    controller = module.get<ExaminationProblemListController>(ExaminationProblemListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
