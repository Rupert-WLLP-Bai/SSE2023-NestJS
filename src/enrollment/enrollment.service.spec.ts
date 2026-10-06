import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let mockRepository: any;

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
        EnrollmentService,
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
  });

  describe('create', () => {
    it('should create an enrollment', async () => {
      mockRepository.save.mockResolvedValue(mockEnrollment);
      const result = await service.create(mockEnrollment as any);
      expect(result).toEqual(mockEnrollment);
    });
  });

  describe('findAll', () => {
    it('should return all enrollments', async () => {
      const enrollments = [mockEnrollment];
      mockRepository.find.mockResolvedValue(enrollments);
      const result = await service.findAll();
      expect(result).toEqual(enrollments);
    });
  });

  describe('findOne', () => {
    it('should return enrollment by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockEnrollment);
      const result = await service.findOne(1);
      expect(result).toEqual(mockEnrollment);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update enrollment', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, { status: 'dropped' } as any);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete enrollment', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findCommon', () => {
    it('should return paginated enrollments', async () => {
      const enrollments = [mockEnrollment];
      mockRepository.findAndCount.mockResolvedValue([enrollments, 1]);
      const result = await service.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      });
      expect(result).toEqual([enrollments, 1]);
    });

    it('should apply filter in query', async () => {
      const enrollments = [mockEnrollment];
      mockRepository.findAndCount.mockResolvedValue([enrollments, 1]);
      await service.findCommon({
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'DESC',
        filter: { studentId: 1 },
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { id: 'DESC' },
        where: { studentId: 1 },
      });
    });

    it('should calculate skip correctly for page 2', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);
      await service.findCommon({
        page: 2,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 10,
        order: { id: 'ASC' },
        where: {},
      });
    });
  });

  describe('findByStudentId', () => {
    it('should return enrollments by student id', async () => {
      const enrollments = [mockEnrollment];
      mockRepository.find.mockResolvedValue(enrollments);
      const result = await service.findByStudentId(1);
      expect(result).toEqual(enrollments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { studentId: 1 },
      });
    });
  });

  describe('findByClassId', () => {
    it('should return enrollments by class id', async () => {
      const enrollments = [mockEnrollment];
      mockRepository.find.mockResolvedValue(enrollments);
      const result = await service.findByClassId(1);
      expect(result).toEqual(enrollments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { classId: 1 },
      });
    });
  });

  describe('findByCourseId', () => {
    it('should return enrollments by course id', async () => {
      const enrollments = [mockEnrollment];
      mockRepository.find.mockResolvedValue(enrollments);
      const result = await service.findByCourseId(1);
      expect(result).toEqual(enrollments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { courseId: 1 },
      });
    });
  });

  describe('findByStudentAndClass', () => {
    it('should return enrollment by student and class', async () => {
      mockRepository.findOne.mockResolvedValue(mockEnrollment);
      const result = await service.findByStudentAndClass(1, 1);
      expect(result).toEqual(mockEnrollment);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { studentId: 1, classId: 1 },
      });
    });

    it('should return null if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.findByStudentAndClass(1, 999);
      expect(result).toBeNull();
    });
  });

  describe('dropCourse', () => {
    it('should drop course successfully', async () => {
      const droppedEnrollment = { ...mockEnrollment, status: 'dropped', dropDate: new Date() };
      mockRepository.findOne.mockResolvedValue(mockEnrollment);
      mockRepository.save.mockResolvedValue(droppedEnrollment);
      const result = await service.dropCourse(1, 1);
      expect(result).toEqual(droppedEnrollment);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should return null if enrollment not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.dropCourse(1, 999);
      expect(result).toBeNull();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
