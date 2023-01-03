import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationStudentListService } from './examination_student_list.service';

describe('ExaminationStudentListService', () => {
  let service: ExaminationStudentListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExaminationStudentListService],
    }).compile();

    service = module.get<ExaminationStudentListService>(ExaminationStudentListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
