import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';

describe('ClassController', () => {
  let controller: ClassController;
  let mockService: any;

  const mockClass = {
    id: 1,
    name: 'Class A',
    courseId: 1,
    teacherId: 1,
    semester: '2023-Fall',
    capacity: 30,
    enrolled: 20,
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findCommon: jest.fn(),
      findByCourseId: jest.fn(),
      findByTeacherId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassController],
      providers: [
        {
          provide: ClassService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ClassController>(ClassController);
  });

  describe('create', () => {
    it('should create class successfully', async () => {
      mockService.create.mockResolvedValue(mockClass);
      const result = await controller.create({
        name: 'Class A',
        courseId: 1,
        teacherId: 1,
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockClass);
    });

    it('should handle error when creating class', async () => {
      mockService.create.mockRejectedValue(new Error('Database error'));
      const result = await controller.create({} as any);
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all classes', async () => {
      mockService.findAll.mockResolvedValue([mockClass]);
      const result = await controller.findAll();
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockClass]);
      expect(result.data.total).toBe(1);
    });

    it('should handle error when finding all', async () => {
      mockService.findAll.mockRejectedValue(new Error('Database error'));
      const result = await controller.findAll();
      expect(result.success).toBe(false);
    });
  });

  describe('findOne', () => {
    it('should return class by id', async () => {
      mockService.findOne.mockResolvedValue(mockClass);
      const result = await controller.findOne('1');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockClass]);
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
    it('should update class successfully', async () => {
      mockService.update.mockResolvedValue({ affected: 1 });
      const result = await controller.update('1', { name: 'Updated' });
      expect(result.success).toBe(true);
    });

    it('should handle error when updating', async () => {
      mockService.update.mockRejectedValue(new Error('Database error'));
      const result = await controller.update('1', {} as any);
      expect(result.success).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete class successfully', async () => {
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
    it('should return paginated classes', async () => {
      mockService.findCommon.mockResolvedValue([[mockClass], 1]);
      const result = await controller.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      });
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockClass]);
      expect(result.data.total).toBe(1);
    });

    it('should handle error in common query', async () => {
      mockService.findCommon.mockRejectedValue(new Error('Database error'));
      const result = await controller.findCommon({} as any);
      expect(result.success).toBe(false);
    });
  });

  describe('findByCourseId', () => {
    it('should return classes by course id', async () => {
      mockService.findByCourseId.mockResolvedValue([mockClass]);
      const result = await controller.findByCourseId('1');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockClass]);
    });

    it('should handle error when finding by course id', async () => {
      mockService.findByCourseId.mockRejectedValue(new Error('Database error'));
      const result = await controller.findByCourseId('1');
      expect(result.success).toBe(false);
    });
  });

  describe('findByTeacherId', () => {
    it('should return classes by teacher id', async () => {
      mockService.findByTeacherId.mockResolvedValue([mockClass]);
      const result = await controller.findByTeacherId('1');
      expect(result.success).toBe(true);
      expect(result.data.list).toEqual([mockClass]);
    });

    it('should handle error when finding by teacher id', async () => {
      mockService.findByTeacherId.mockRejectedValue(
        new Error('Database error'),
      );
      const result = await controller.findByTeacherId('1');
      expect(result.success).toBe(false);
    });
  });
});
