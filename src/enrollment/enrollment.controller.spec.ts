import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentController', () => {
  let controller: EnrollmentController;
  let mockService: any;

  const mockEnrollment = {
    id: 1,
    studentId: 1,
    classId: 1,
    courseId: 1,
    status: 'active',
    enrollDate: new Date(),
    dropDate: null,
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findCommon: jest.fn(),
      findByStudentId: jest.fn(),
      findByClassId: jest.fn(),
      findByCourseId: jest.fn(),
      dropCourse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [
        {
          provide: EnrollmentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
  });

  describe('create', () => {
    it('should create enrollment successfully', async () => {
      mockService.create.mockResolvedValue(mockEnrollment);
      const result = await controller.create(mockEnrollment as any);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockEnrollment);
    });

    it('should handle error when creating enrollment', async () => {
      mockService.create.mockRejectedValue(new Error('Database error'));
      const result = await controller.create(mockEnrollment as any);
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all enrollments', async () => {
      mockService.findAll.mockResolvedValue([mockEnrollment]);
      const result = await controller.findAll();
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockEnrollment]);
      expect(result.data.total).toBe(1);
    });

    it('should handle error when finding all', async () => {
      mockService.findAll.mockRejectedValue(new Error('Database error'));
      const result = await controller.findAll();
      expect(result.success).toBe(false);
    });
  });

  describe('findOne', () => {
    it('should return enrollment by id', async () => {
      mockService.findOne.mockResolvedValue(mockEnrollment);
      const result = await controller.findOne('1');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockEnrollment]);
    });

    it('should return empty list when not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      const result = await controller.findOne('999');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([]);
    });

    it('should handle error', async () => {
      mockService.findOne.mockRejectedValue(new Error('Database error'));
      const result = await controller.findOne('1');
      expect(result.success).toBe(false);
    });
  });

  describe('update', () => {
    it('should update enrollment successfully', async () => {
      mockService.update.mockResolvedValue({ affected: 1 });
      const result = await controller.update('1', { status: 'dropped' } as any);
      expect(result.success).toBe(true);
    });

    it('should handle error when updating', async () => {
      mockService.update.mockRejectedValue(new Error('Database error'));
      const result = await controller.update('1', {} as any);
      expect(result.success).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete enrollment successfully', async () => {
      mockService.remove.mockResolvedValue({ affected: 1 });
      const result = await controller.remove('1');
      expect(result.success).toBe(true);
    });

    it('should handle error when deleting', async () => {
      mockService.remove.mockRejectedValue(new Error('Database error'));
      const result = await controller.remove('1');
      expect(result.success).toBe(false);
    });
  });

  describe('findCommon', () => {
    it('should return paginated enrollments', async () => {
      mockService.findCommon.mockResolvedValue([[mockEnrollment], 1]);
      const result = await controller.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      } as any);
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockEnrollment]);
      expect(result.data.total).toBe(1);
    });

    it('should handle error in common query', async () => {
      mockService.findCommon.mockRejectedValue(new Error('Database error'));
      const result = await controller.findCommon({} as any);
      expect(result.success).toBe(false);
    });
  });

  describe('findByStudentId', () => {
    it('should return enrollments by student id', async () => {
      mockService.findByStudentId.mockResolvedValue([mockEnrollment]);
      const result = await controller.findByStudentId('1');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockEnrollment]);
    });

    it('should handle error when finding by student id', async () => {
      mockService.findByStudentId.mockRejectedValue(
        new Error('Database error'),
      );
      const result = await controller.findByStudentId('1');
      expect(result.success).toBe(false);
    });
  });

  describe('findByClassId', () => {
    it('should return enrollments by class id', async () => {
      mockService.findByClassId.mockResolvedValue([mockEnrollment]);
      const result = await controller.findByClassId('1');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockEnrollment]);
    });

    it('should handle error when finding by class id', async () => {
      mockService.findByClassId.mockRejectedValue(new Error('Database error'));
      const result = await controller.findByClassId('1');
      expect(result.success).toBe(false);
    });
  });

  describe('findByCourseId', () => {
    it('should return enrollments by course id', async () => {
      mockService.findByCourseId.mockResolvedValue([mockEnrollment]);
      const result = await controller.findByCourseId('1');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockEnrollment]);
    });

    it('should handle error when finding by course id', async () => {
      mockService.findByCourseId.mockRejectedValue(new Error('Database error'));
      const result = await controller.findByCourseId('1');
      expect(result.success).toBe(false);
    });
  });

  describe('dropCourse', () => {
    it('should drop course successfully', async () => {
      const droppedEnrollment = { ...mockEnrollment, status: 'dropped' };
      mockService.dropCourse.mockResolvedValue(droppedEnrollment);
      const result = await controller.dropCourse('1', '1');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(droppedEnrollment);
    });

    it('should return null when enrollment not found', async () => {
      mockService.dropCourse.mockResolvedValue(null);
      const result = await controller.dropCourse('1', '999');
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });

    it('should handle error when dropping course', async () => {
      mockService.dropCourse.mockRejectedValue(new Error('Database error'));
      const result = await controller.dropCourse('1', '1');
      expect(result.success).toBe(false);
    });
  });
});
