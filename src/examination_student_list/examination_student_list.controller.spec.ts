import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationStudentList } from './entities/examination_student_list.entity';
import { ExaminationStudentListController } from './examination_student_list.controller';
import { ExaminationStudentListService } from './examination_student_list.service';

describe('ExaminationStudentListController', () => {
  let controller: ExaminationStudentListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationStudentListController],
      providers: [
        ExaminationStudentListService,
        {
          provide: getRepositoryToken(ExaminationStudentList),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ExaminationStudentListController>(
      ExaminationStudentListController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
