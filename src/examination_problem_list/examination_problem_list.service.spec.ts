import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExaminationProblemList, ProblemType } from './entities/examination_problem_list.entity';
import { ExaminationProblemListService } from './examination_problem_list.service';

describe('ExaminationProblemListService', () => {
  let service: ExaminationProblemListService;
  let mockRepository: any;

  const mockProblemList = {
    id: 1,
    examinationId: 1,
    problemId: 101,
    problemTitle: '测试题目',
    problemContent: '这是题目内容',
    problemScore: 10,
    problemType: ProblemType.SINGLE_CHOICE,
    problemOrder: 1,
    answer: 'A',
    createTime: new Date(),
    updateTime: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
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
        ExaminationProblemListService,
        {
          provide: getRepositoryToken(ExaminationProblemList),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExaminationProblemListService>(ExaminationProblemListService);
  });

  describe('create', () => {
    it('should create a problem list', async () => {
      const createDto = {
        examinationId: 1,
        problemId: 101,
        problemTitle: '测试题目',
        problemContent: '这是题目内容',
        problemScore: 10,
        problemType: ProblemType.SINGLE_CHOICE,
        problemOrder: 1,
        answer: 'A',
      };

      mockRepository.create.mockReturnValue(mockProblemList);
      mockRepository.save.mockResolvedValue(mockProblemList);

      const result = await service.create(createDto as any);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProblemList);
      expect(result).toEqual(mockProblemList);
    });
  });

  describe('findAll', () => {
    it('should return all problem lists', async () => {
      mockRepository.find.mockResolvedValue([mockProblemList]);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockProblemList]);
    });

    it('should return empty array when no data', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findAndCount', () => {
    it('should return problem lists with count', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockProblemList], 1]);

      const result = await service.findAndCount();

      expect(mockRepository.findAndCount).toHaveBeenCalled();
      expect(result).toEqual([[mockProblemList], 1]);
    });

    it('should return empty array with zero count', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAndCount();

      expect(result).toEqual([[], 0]);
    });
  });

  describe('findOne', () => {
    it('should return problem list by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockProblemList);

      const result = await service.findOne(1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockProblemList);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByExaminationId', () => {
    it('should return problem lists by examination id', async () => {
      const problems = [mockProblemList, { ...mockProblemList, id: 2, problemOrder: 2 }];
      mockRepository.find.mockResolvedValue(problems);

      const result = await service.findByExaminationId(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { examinationId: 1 },
        order: { problemOrder: 'ASC' },
      });
      expect(result).toEqual(problems);
    });

    it('should return empty array when no problems found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByExaminationId(999);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update problem list', async () => {
      const updateDto = {
        problemTitle: '更新后的标题',
        problemScore: 20,
      };

      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateDto as any);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual({ affected: 1 });
    });

    it('should return affected 0 when not found', async () => {
      const updateDto = { problemTitle: '更新后的标题' };

      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.update(999, updateDto as any);

      expect(result).toEqual({ affected: 0 });
    });
  });

  describe('remove', () => {
    it('should delete problem list', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });

    it('should return affected 0 when not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result).toEqual({ affected: 0 });
    });
  });

  describe('findPage', () => {
    it('should return paginated problem lists', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockProblemList], 1]);

      const result = await service.findPage(1, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
      });
      expect(result).toEqual([[mockProblemList], 1]);
    });

    it('should calculate skip correctly for page 2', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockProblemList], 1]);

      await service.findPage(2, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 10,
      });
    });

    it('should handle different page sizes', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockProblemList], 1]);

      await service.findPage(1, 20);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 20,
        skip: 0,
      });
    });
  });
});
