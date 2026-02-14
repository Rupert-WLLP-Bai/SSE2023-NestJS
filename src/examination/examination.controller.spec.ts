import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Examination } from './entities/examination.entity';
import { ExaminationController } from './examination.controller';
import { ExaminationService } from './examination.service';

describe('ExaminationController', () => {
  let controller: ExaminationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationController],
      providers: [
        ExaminationService,
        {
          provide: getRepositoryToken(Examination),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ExaminationController>(ExaminationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
