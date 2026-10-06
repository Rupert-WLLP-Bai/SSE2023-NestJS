import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { ClassService } from './class.service';

describe('ClassService', () => {
  let service: ClassService;
  let mockRepository: any;

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
        ClassService,
        {
          provide: getRepositoryToken(Class),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClassService>(ClassService);
  });

  describe('create', () => {
    it('should create a class', async () => {
      mockRepository.save.mockResolvedValue(mockClass);
      const result = await service.create({
        name: 'Class A',
        courseId: 1,
        teacherId: 1,
      });
      expect(result).toEqual(mockClass);
      expect(mockRepository.save).toHaveBeenCalledWith({
        name: 'Class A',
        courseId: 1,
        teacherId: 1,
      });
    });
  });

  describe('findAll', () => {
    it('should return all classes', async () => {
      const classes = [mockClass];
      mockRepository.find.mockResolvedValue(classes);
      const result = await service.findAll();
      expect(result).toEqual(classes);
    });
  });

  describe('findOne', () => {
    it('should return class by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockClass);
      const result = await service.findOne(1);
      expect(result).toEqual(mockClass);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update class', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, { name: 'Updated Class' });
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete class', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findCommon', () => {
    it('should return paginated classes', async () => {
      const classes = [mockClass];
      mockRepository.findAndCount.mockResolvedValue([classes, 1]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      });
      expect(result).toEqual([classes, 1]);
    });

    it('should apply filter in query', async () => {
      const classes = [mockClass];
      mockRepository.findAndCount.mockResolvedValue([classes, 1]);
      await service.findCommon({
        page: 1,
        limit: 10,
        sort: 'name',
        order: 'DESC',
        filter: { courseId: 1 },
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { name: 'DESC' },
        where: { courseId: 1 },
      });
    });
  });

  describe('findByCourseId', () => {
    it('should return classes by course id', async () => {
      const classes = [mockClass];
      mockRepository.find.mockResolvedValue(classes);
      const result = await service.findByCourseId(1);
      expect(result).toEqual(classes);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { courseId: 1 },
      });
    });
  });

  describe('findByTeacherId', () => {
    it('should return classes by teacher id', async () => {
      const classes = [mockClass];
      mockRepository.find.mockResolvedValue(classes);
      const result = await service.findByTeacherId(1);
      expect(result).toEqual(classes);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { teacherId: 1 },
      });
    });
  });
});
