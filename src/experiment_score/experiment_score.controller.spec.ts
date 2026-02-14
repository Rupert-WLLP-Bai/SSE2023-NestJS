import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperimentScore } from './entities/experiment_score.entity';
import { ExperimentScoreController } from './experiment_score.controller';
import { ExperimentScoreService } from './experiment_score.service';
import { AuditService } from '../audit/audit.service';
import { AuditLog } from '../audit/entities/audit_log.entity';

describe('ExperimentScoreController', () => {
  let controller: ExperimentScoreController;
  let mockRepository: any;
  let mockAuditRepository: any;

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
    mockAuditRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentScoreController],
      providers: [
        ExperimentScoreService,
        AuditService,
        {
          provide: getRepositoryToken(ExperimentScore),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockAuditRepository,
        },
      ],
    }).compile();

    controller = module.get<ExperimentScoreController>(
      ExperimentScoreController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
