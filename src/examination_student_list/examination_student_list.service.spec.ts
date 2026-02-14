import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ExaminationStudentList } from './entities/examination_student_list.entity';
import { ExaminationStudentListService } from './examination_student_list.service';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { User } from '../user/entities/user.entity';

describe('ExaminationStudentListService', () => {
  let service: ExaminationStudentListService;

  beforeEach(async () => {
    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn().mockResolvedValue({}),
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationStudentListService,
        {
          provide: getRepositoryToken(ExaminationStudentList),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockResolvedValue([]),
            findAndCount: jest.fn().mockResolvedValue([[], 0]),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Enrollment),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findByIds: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
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
