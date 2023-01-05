import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

describe('NoticeController', () => {
  let controller: NoticeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeController],
      providers: [
        NoticeService,
        {
          provide: getRepositoryToken(Notice),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<NoticeController>(NoticeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
