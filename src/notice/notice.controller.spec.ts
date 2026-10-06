import { Notice } from './entities/notice.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

describe('NoticeController', () => {
  let controller: NoticeController;
  let mockNoticeService: Partial<NoticeService>;

  const mockNotice = {
    id: 1,
    title: 'Test Notice',
    content: 'This is a test notice',
    publisherId: 1,
    publisherName: 'Admin',
    createTime: new Date(),
    updateTime: new Date(),
  };

  beforeEach(async () => {
    mockNoticeService = {
      create: jest.fn().mockResolvedValue(mockNotice),
      findAll: jest.fn().mockResolvedValue([mockNotice]),
      findAllAndCount: jest.fn().mockResolvedValue([[mockNotice], 1]),
      findOne: jest.fn().mockResolvedValue(mockNotice),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      remove: jest.fn().mockResolvedValue({ affected: 1 }),
      findPage: jest.fn().mockResolvedValue([[mockNotice], 1]),
      findCommon: jest.fn().mockResolvedValue([[mockNotice], 1]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeController],
      providers: [
        {
          provide: NoticeService,
          useValue: mockNoticeService,
        },
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

  describe('create', () => {
    it('should create a notice successfully', async () => {
      const createDto = { title: 'Test Notice', content: 'Content' };
      const result = await controller.create(createDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockNotice);
      expect(mockNoticeService.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle error when creating notice fails', async () => {
      (mockNoticeService.create as jest.Mock).mockRejectedValueOnce(
        new Error('Database error'),
      );
      const createDto = { title: 'Test Notice', content: 'Content' };
      const result = await controller.create(createDto);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Database error');
    });
  });

  describe('findOne', () => {
    it('should return notice by id', async () => {
      const result = await controller.findOne('1');

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockNotice]);
      expect(result.data.total).toBe(1);
      expect(mockNoticeService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return empty list when notice not found', async () => {
      (mockNoticeService.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await controller.findOne('999');

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([null]);
      expect(result.data.total).toBe(0);
    });
  });

  describe('update', () => {
    it('should update notice successfully', async () => {
      const updateDto = { title: 'Updated Title' };
      const result = await controller.update('1', updateDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ affected: 1 });
      expect(mockNoticeService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete notice successfully', async () => {
      const result = await controller.remove('1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ affected: 1 });
      expect(mockNoticeService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findPage', () => {
    it('should return paginated results when page and pageSize provided', async () => {
      const result = await controller.findPage(1, 10);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockNotice]);
      expect(result.data.total).toBe(1);
      expect(result.data.current).toBe(1);
      expect(result.data.pageSize).toBe(10);
      expect(mockNoticeService.findPage).toHaveBeenCalledWith(1, 10);
    });

    it('should return all results when page and pageSize not provided', async () => {
      const result = await controller.findPage(undefined, undefined);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockNotice]);
      expect(result.data.total).toBe(1);
      expect(mockNoticeService.findAllAndCount).toHaveBeenCalled();
    });
  });

  describe('findCommon', () => {
    it('should return filtered and sorted results', async () => {
      const queryDto = {
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC' as const,
        filter: { title: 'Test' },
      };
      const result = await controller.findCommon(queryDto);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockNotice]);
      expect(result.data.total).toBe(1);
      expect(mockNoticeService.findCommon).toHaveBeenCalledWith(queryDto);
    });

    it('should handle error when query fails', async () => {
      (mockNoticeService.findCommon as jest.Mock).mockRejectedValueOnce(
        new Error('Query error'),
      );
      const queryDto = { page: 1, limit: 10 };
      const result = await controller.findCommon(queryDto);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Query error');
    });
  });
});
