import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationScore } from './entities/examination_score.entity';
import { ExaminationScoreController } from './examination_score.controller';
import { ExaminationScoreService } from './examination_score.service';
import { ExaminationSubmitService } from '../examination_submit/examination_submit.service';
import { AuditService } from '../audit/audit.service';

describe('ExaminationScoreController', () => {
  let controller: ExaminationScoreController;
  let mockRepository: any;
  let mockExaminationSubmitService: any;
  let mockAuditService: any;

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

    mockAuditService = {
      create: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationScoreController],
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
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    controller = module.get<ExaminationScoreController>(
      ExaminationScoreController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
