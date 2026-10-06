import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

describe('CourseController', () => {
  let controller: CourseController;
  let mockService: any;

  const mockCourse = {
    id: 1,
    name: 'Math 101',
    code: 'MATH101',
    description: 'Introduction to Mathematics',
    credit: 3,
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findCommon: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
  });

  describe('create', () => {
    it('should create course', async () => {
      mockService.create.mockResolvedValue(mockCourse);
      const result = await controller.create({} as any);
      expect(result).toEqual(mockCourse);
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      mockService.findAll.mockResolvedValue([mockCourse]);
      const result = await controller.findAll();
      expect(result.list).toEqual([mockCourse]);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return course by id', async () => {
      mockService.findOne.mockResolvedValue(mockCourse);
      const result = await controller.findOne('1');
      expect(result.list).toEqual([mockCourse]);
    });

    it('should return empty when not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      const result = await controller.findOne('999');
      expect(result.list).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update course', async () => {
      mockService.update.mockResolvedValue({ affected: 1 });
      const result = await controller.update('1', {} as any);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete course', async () => {
      mockService.remove.mockResolvedValue({ affected: 1 });
      const result = await controller.remove('1');
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findCommon', () => {
    it('should return paginated courses', async () => {
      mockService.findCommon.mockResolvedValue([[mockCourse], 1]);
      const result = await controller.findCommon({} as any);
      expect(result.list).toEqual([mockCourse]);
    });
  });
});
