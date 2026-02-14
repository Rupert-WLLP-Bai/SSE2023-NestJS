import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationSubmit } from './entities/examination_submit.entity';
import { ExaminationSubmitService } from './examination_submit.service';
import { ExaminationService } from '../examination/examination.service';
import { Examination } from '../examination/entities/examination.entity';

describe('ExaminationSubmitService', () => {
  let service: ExaminationSubmitService;
  let mockRepository: any;
  let mockExaminationService: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockExaminationService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationSubmitService,
        {
          provide: getRepositoryToken(ExaminationSubmit),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Examination),
          useValue: mockRepository,
        },
        {
          provide: ExaminationService,
          useValue: mockExaminationService,
        },
      ],
    }).compile();

    service = module.get<ExaminationSubmitService>(ExaminationSubmitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
