import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationProblemList } from './entities/examination_problem_list.entity';
import { ExaminationProblemListService } from './examination_problem_list.service';

describe('ExaminationProblemListService', () => {
  let service: ExaminationProblemListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationProblemListService,
        {
          provide: getRepositoryToken(ExaminationProblemList),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ExaminationProblemListService>(
      ExaminationProblemListService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
