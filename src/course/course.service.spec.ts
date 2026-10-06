import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;
  let mockRepository: any;

  const mockCourse = {
    id: 1,
    name: 'Math 101',
    code: 'MATH101',
    description: 'Introduction to Mathematics',
    credit: 3,
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
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  describe('create', () => {
    it('should create a course', async () => {
      mockRepository.save.mockResolvedValue(mockCourse);
      const result = await service.create({ name: 'Math 101' });
      expect(result).toEqual(mockCourse);
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      mockRepository.find.mockResolvedValue([mockCourse]);
      const result = await service.findAll();
      expect(result).toEqual([mockCourse]);
    });
  });

  describe('findOne', () => {
    it('should return course by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockCourse);
      const result = await service.findOne(1);
      expect(result).toEqual(mockCourse);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update course', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, { name: 'Updated' });
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete course', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findCommon', () => {
    it('should return paginated courses', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockCourse], 1]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      });
      expect(result).toEqual([[mockCourse], 1]);
    });
  });
});
