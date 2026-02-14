import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Examination } from './entities/examination.entity';
import { ExaminationService } from './examination.service';

describe('ExaminationService', () => {
  let service: ExaminationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationService,
        {
          provide: getRepositoryToken(Examination),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ExaminationService>(ExaminationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
