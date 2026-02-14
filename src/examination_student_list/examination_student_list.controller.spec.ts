import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ExaminationStudentList } from './entities/examination_student_list.entity';
import { ExaminationStudentListController } from './examination_student_list.controller';
import { ExaminationStudentListService } from './examination_student_list.service';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { User } from '../user/entities/user.entity';

describe('ExaminationStudentListController', () => {
  let controller: ExaminationStudentListController;
  let mockRepository: any;
  let mockDataSource: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          delete: jest.fn(),
          create: jest.fn(),
          save: jest.fn(),
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationStudentListController],
      providers: [
        ExaminationStudentListService,
        {
          provide: getRepositoryToken(ExaminationStudentList),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
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
