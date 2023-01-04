import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationProblemListService } from './examination_problem_list.service';

describe('ExaminationProblemListService', () => {
  let service: ExaminationProblemListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExaminationProblemListService],
    }).compile();

    service = module.get<ExaminationProblemListService>(
      ExaminationProblemListService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
