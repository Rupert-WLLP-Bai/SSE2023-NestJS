import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationStudentListController } from './examination_student_list.controller';
import { ExaminationStudentListService } from './examination_student_list.service';

describe('ExaminationStudentListController', () => {
  let controller: ExaminationStudentListController;
  let mockService: any;

  const mockStudentList = {
    id: 1,
    examinationId: 1,
    studentId: 1,
    studentName: 'John Doe',
    studentNumber: '12345',
    status: 0,
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
      findByStudentId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findPage: jest.fn(),
      importStudentsFromClass: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationStudentListController],
      providers: [
        {
          provide: ExaminationStudentListService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ExaminationStudentListController>(
      ExaminationStudentListController,
    );
  });

  describe('create', () => {
    it('should create student list successfully', async () => {
      mockService.create.mockResolvedValue(mockStudentList);
      const result = await controller.create({
        examinationId: 1,
        studentId: 1,
      } as any);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStudentList);
    });

    it('should handle error when creating', async () => {
      mockService.create.mockRejectedValue(new Error('Database error'));
      const result = await controller.create({} as any);
      expect(result.success).toBe(false);
    });
  });

  describe('findPage', () => {
    it('should return paginated results when page and pageSize provided', async () => {
      mockService.findPage.mockResolvedValue([[mockStudentList], 1]);
      const result = await controller.findPage(1, 10);
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockStudentList]);
      expect(result.data.total).toBe(1);
    });

    it('should return all results when page not provided', async () => {
      mockService.findAndCount.mockResolvedValue([[mockStudentList], 1]);
      const result = await controller.findPage(undefined, undefined);
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockStudentList]);
    });
  });

  describe('findByExaminationId', () => {
    it('should return student lists by examination id', async () => {
      mockService.findByExaminationId.mockResolvedValue([mockStudentList]);
      const result = await controller.findByExaminationId('1');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockStudentList]);
    });
  });

  describe('findByStudentId', () => {
    it('should return student lists by student id', async () => {
      mockService.findByStudentId.mockResolvedValue([mockStudentList]);
      const result = await controller.findByStudentId('1');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockStudentList]);
    });
  });

  describe('findOne', () => {
    it('should return student list by id', async () => {
      mockService.findOne.mockResolvedValue(mockStudentList);
      const result = await controller.findOne('1');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockStudentList]);
    });

    it('should return list with null when not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      const result = await controller.findOne('999');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([null]);
    });
  });

  describe('update', () => {
    it('should update student list successfully', async () => {
      mockService.update.mockResolvedValue({ affected: 1 });
      const result = await controller.update('1', { status: 1 } as any);
      expect(result.success).toBe(true);
    });

    it('should handle error when updating', async () => {
      mockService.update.mockRejectedValue(new Error('Database error'));
      const result = await controller.update('1', {} as any);
      expect(result.success).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete student list successfully', async () => {
      mockService.remove.mockResolvedValue({ affected: 1 });
      const result = await controller.remove('1');
      expect(result.success).toBe(true);
      expect(result.data.affected).toBe(1);
    });

    it('should handle error when deleting', async () => {
      mockService.remove.mockRejectedValue(new Error('Database error'));
      const result = await controller.remove('1');
      expect(result.success).toBe(false);
    });
  });

  describe('importClass', () => {
    it('should import students from class successfully', async () => {
      mockService.importStudentsFromClass.mockResolvedValue({
        added: 10,
        skipped: 2,
        total: 12,
      });
      const result = await controller.importClass(1, 1);
      expect(result.success).toBe(true);
      expect(result.data.added).toBe(10);
    });

    it('should handle error when importing', async () => {
      mockService.importStudentsFromClass.mockRejectedValue(
        new Error('Import error'),
      );
      const result = await controller.importClass(1, 1);
      expect(result.success).toBe(false);
    });
  });
});
