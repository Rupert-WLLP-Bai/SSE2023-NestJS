import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationSubmit } from './entities/examination_submit.entity';
import { ExaminationSubmitController } from './examination_submit.controller';
import { ExaminationSubmitService } from './examination_submit.service';
import { ExaminationService } from '../examination/examination.service';

describe('ExaminationSubmitController', () => {
  let controller: ExaminationSubmitController;
  let mockRepository: any;
  let mockExaminationService: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockExaminationService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationSubmitController],
      providers: [
        ExaminationSubmitService,
        {
          provide: getRepositoryToken(ExaminationSubmit),
          useValue: mockRepository,
        },
        {
          provide: ExaminationService,
          useValue: mockExaminationService,
        },
      ],
    }).compile();

    controller = module.get<ExaminationSubmitController>(
      ExaminationSubmitController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
