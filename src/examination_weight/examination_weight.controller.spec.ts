import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationWeight } from './entities/examination_weight.entity';
import { ExaminationWeightController } from './examination_weight.controller';
import { ExaminationWeightService } from './examination_weight.service';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { AuditService } from '../audit/audit.service';
import { AuditLog } from '../audit/entities/audit_log.entity';

describe('ExaminationWeightController', () => {
  let controller: ExaminationWeightController;
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
      controllers: [ExaminationWeightController],
      providers: [
        ExaminationWeightService,
        AuditService,
        {
          provide: getRepositoryToken(ExaminationWeight),
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

    controller = module.get<ExaminationWeightController>(
      ExaminationWeightController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
