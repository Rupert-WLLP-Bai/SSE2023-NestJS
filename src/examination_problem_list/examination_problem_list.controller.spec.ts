import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationProblemListController } from './examination_problem_list.controller';
import { ExaminationProblemListService } from './examination_problem_list.service';
import { ProblemType } from './entities/examination_problem_list.entity';

describe('ExaminationProblemListController', () => {
  let controller: ExaminationProblemListController;
  let mockService: any;

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
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      findByExaminationId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findPage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationProblemListController],
      providers: [
        {
          provide: ExaminationProblemListService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ExaminationProblemListController>(
      ExaminationProblemListController,
    );
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

      mockService.create.mockResolvedValue(mockProblemList);

      const result = await controller.create(createDto as any);

      expect(mockService.create).toHaveBeenCalledWith(createDto);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProblemList);
    });

    it('should handle error when creation fails', async () => {
      const createDto = {
        examinationId: 1,
        problemId: 101,
      };

      mockService.create.mockRejectedValue(new Error('Database error'));

      const result = await controller.create(createDto as any);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Database error');
    });
  });

  describe('findPage', () => {
    it('should return paginated results when page and pageSize provided', async () => {
      mockService.findPage.mockResolvedValue([[mockProblemList], 1]);

      const result = await controller.findPage(1, 10);

      expect(mockService.findPage).toHaveBeenCalledWith(1, 10);
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockProblemList]);
      expect(result.data.total).toBe(1);
      expect(result.data.current).toBe(1);
      expect(result.data.pageSize).toBe(10);
    });

    it('should return all results when page not provided', async () => {
      mockService.findAndCount.mockResolvedValue([[mockProblemList], 1]);

      const result = await controller.findPage(undefined, undefined);

      expect(mockService.findAndCount).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockProblemList]);
      expect(result.data.total).toBe(1);
    });

    it('should handle empty results', async () => {
      mockService.findAndCount.mockResolvedValue([[], 0]);

      const result = await controller.findPage(undefined, undefined);

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
      expect(result.data.total).toBe(0);
    });
  });

  describe('findByExaminationId', () => {
    it('should return problem lists by examination id', async () => {
      const problems = [mockProblemList, { ...mockProblemList, id: 2 }];
      mockService.findByExaminationId.mockResolvedValue(problems);

      const result = await controller.findByExaminationId('1');

      expect(mockService.findByExaminationId).toHaveBeenCalledWith(1);
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual(problems);
      expect(result.data.total).toBe(2);
    });

    it('should return empty list when no problems found', async () => {
      mockService.findByExaminationId.mockResolvedValue([]);

      const result = await controller.findByExaminationId('999');

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
      expect(result.data.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return problem list by id', async () => {
      mockService.findOne.mockResolvedValue(mockProblemList);

      const result = await controller.findOne('1');

      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockProblemList]);
      expect(result.data.total).toBe(1);
    });

    it('should return list with null when not found', async () => {
      mockService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([null]);
      expect(result.data.total).toBe(0);
    });
  });

  describe('update', () => {
    it('should update problem list', async () => {
      const updateDto = {
        problemTitle: '更新后的标题',
        problemScore: 20,
      };

      mockService.update.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });

      const result = await controller.update('1', updateDto as any);

      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.success).toBe(true);
      expect(result.data.affected).toBe(1);
    });

    it('should handle error when update fails', async () => {
      const updateDto = { problemTitle: '更新后的标题' };

      mockService.update.mockRejectedValue(new Error('Update failed'));

      const result = await controller.update('1', updateDto as any);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Update failed');
    });
  });

  describe('remove', () => {
    it('should delete problem list', async () => {
      mockService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove('1');

      expect(mockService.remove).toHaveBeenCalledWith(1);
      expect(result.success).toBe(true);
      expect(result.data.affected).toBe(1);
    });

    it('should handle error when delete fails', async () => {
      mockService.remove.mockRejectedValue(new Error('Delete failed'));

      const result = await controller.remove('1');

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Delete failed');
    });

    it('should return affected 0 when problem not found', async () => {
      mockService.remove.mockResolvedValue({ affected: 0 });

      const result = await controller.remove('999');

      expect(result.success).toBe(true);
      expect(result.data.affected).toBe(0);
    });
  });
});
