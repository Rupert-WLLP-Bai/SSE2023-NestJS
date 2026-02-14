import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperimentWeight } from './entities/experiment_weight.entity';
import { ExperimentWeightController } from './experiment_weight.controller';
import { ExperimentWeightService } from './experiment_weight.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { AuditService } from '../audit/audit.service';
import { AuditLog } from '../audit/entities/audit_log.entity';

describe('ExperimentWeightController', () => {
  let controller: ExperimentWeightController;
  let mockRepository: any;
  let mockAuditRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
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
      controllers: [ExperimentWeightController],
      providers: [
        ExperimentWeightService,
        AuditService,
        {
          provide: getRepositoryToken(ExperimentWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(TotalWeight),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockAuditRepository,
        },
      ],
    }).compile();

    controller = module.get<ExperimentWeightController>(
      ExperimentWeightController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
