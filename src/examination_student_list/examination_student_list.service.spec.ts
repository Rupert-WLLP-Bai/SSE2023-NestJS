import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationStudentList } from './entities/examination_student_list.entity';
import { ExaminationStudentListService } from './examination_student_list.service';

describe('ExaminationStudentListService', () => {
  let service: ExaminationStudentListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationStudentListService,
        {
          provide: getRepositoryToken(ExaminationStudentList),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ExaminationStudentListService>(
      ExaminationStudentListService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
