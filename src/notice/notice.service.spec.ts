import { Notice } from './entities/notice.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NoticeService } from './notice.service';

describe('NoticeService', () => {
  let service: NoticeService;
  let mockRepository: any;

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
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticeService,
        {
          provide: getRepositoryToken(Notice),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NoticeService>(NoticeService);
  });

  describe('create', () => {
    it('should create a notice', async () => {
      mockRepository.save.mockResolvedValue(mockNotice);
      const result = await service.create({
        title: 'Test Notice',
        content: 'Content',
      });
      expect(result).toEqual(mockNotice);
    });
  });

  describe('findAll', () => {
    it('should return all notices', async () => {
      mockRepository.find.mockResolvedValue([mockNotice]);
      const result = await service.findAll();
      expect(result).toEqual([mockNotice]);
    });
  });

  describe('findAllAndCount', () => {
    it('should return notices with count', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockNotice], 1]);
      const result = await service.findAllAndCount();
      expect(result).toEqual([[mockNotice], 1]);
    });
  });

  describe('findOne', () => {
    it('should return notice by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockNotice);
      const result = await service.findOne(1);
      expect(result).toEqual(mockNotice);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update notice', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, { title: 'Updated' });
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete notice', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findPage', () => {
    it('should return paginated notices', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockNotice], 1]);
      const result = await service.findPage(1, 10);
      expect(result).toEqual([[mockNotice], 1]);
    });
  });

  describe('findCommon', () => {
    it('should return notices with filter', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockNotice], 1]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      });
      expect(result).toEqual([[mockNotice], 1]);
    });
  });
});
