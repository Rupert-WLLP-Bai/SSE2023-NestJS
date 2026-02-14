import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationScore } from './entities/examination_score.entity';
import { ExaminationScoreService } from './examination_score.service';
import { ExaminationSubmitService } from '../examination_submit/examination_submit.service';

describe('ExaminationScoreService', () => {
  let service: ExaminationScoreService;
  let mockRepository: any;
  let mockExaminationSubmitService: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockExaminationSubmitService = {
      validateSubmitted: jest.fn().mockResolvedValue(undefined),
      markAsGraded: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationScoreService,
        {
          provide: getRepositoryToken(ExaminationScore),
          useValue: mockRepository,
        },
        {
          provide: ExaminationSubmitService,
          useValue: mockExaminationSubmitService,
        },
      ],
    }).compile();

    service = module.get<ExaminationScoreService>(ExaminationScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
