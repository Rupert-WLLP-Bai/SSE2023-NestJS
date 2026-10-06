import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ExaminationStudentList } from './entities/examination_student_list.entity';
import { ExaminationStudentListService } from './examination_student_list.service';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { User } from '../user/entities/user.entity';

describe('ExaminationStudentListService', () => {
  let service: ExaminationStudentListService;
  let mockRepository: any;
  let mockEnrollmentRepository: any;
  let mockUserRepository: any;
  let mockDataSource: any;

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

  const mockEnrollment = {
    id: 1,
    studentId: 1,
    classId: 1,
    studentName: 'John Doe',
  };

  const mockUser = {
    id: 1,
    name: 'John Doe',
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockEnrollmentRepository = {
      find: jest.fn().mockResolvedValue([]),
    };

    mockUserRepository = {
      findBy: jest.fn().mockResolvedValue([]),
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn().mockResolvedValue({}),
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationStudentListService,
        {
          provide: getRepositoryToken(ExaminationStudentList),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockEnrollmentRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ExaminationStudentListService>(
      ExaminationStudentListService,
    );
  });

  describe('create', () => {
    it('should create a student list entry', async () => {
      mockRepository.create.mockReturnValue(mockStudentList);
      mockRepository.save.mockResolvedValue(mockStudentList);
      const result = await service.create({
        examinationId: 1,
        studentId: 1,
      } as any);
      expect(result).toEqual(mockStudentList);
    });
  });

  describe('findAll', () => {
    it('should return all student lists', async () => {
      mockRepository.find.mockResolvedValue([mockStudentList]);
      const result = await service.findAll();
      expect(result).toEqual([mockStudentList]);
    });
  });

  describe('findAndCount', () => {
    it('should return student lists with count', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockStudentList], 1]);
      const result = await service.findAndCount();
      expect(result).toEqual([[mockStudentList], 1]);
    });
  });

  describe('findOne', () => {
    it('should return student list by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockStudentList);
      const result = await service.findOne(1);
      expect(result).toEqual(mockStudentList);
    });

    it('should return null if not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('findByExaminationId', () => {
    it('should return student lists by examination id', async () => {
      mockRepository.find.mockResolvedValue([mockStudentList]);
      const result = await service.findByExaminationId(1);
      expect(result).toEqual([mockStudentList]);
    });
  });

  describe('findByStudentId', () => {
    it('should return student lists by student id', async () => {
      mockRepository.find.mockResolvedValue([mockStudentList]);
      const result = await service.findByStudentId(1);
      expect(result).toEqual([mockStudentList]);
    });
  });

  describe('update', () => {
    it('should update student list', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, { status: 1 } as any);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete student list', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('findPage', () => {
    it('should return paginated student lists', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockStudentList], 1]);
      const result = await service.findPage(1, 10);
      expect(result).toEqual([[mockStudentList], 1]);
    });
  });

  describe('importStudentsFromClass', () => {
    it('should import students from class', async () => {
      mockEnrollmentRepository.find.mockResolvedValue([mockEnrollment]);
      mockUserRepository.findBy.mockResolvedValue([mockUser]);
      mockRepository.find.mockResolvedValue([]);
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.importStudentsFromClass(1, 1);
      expect(result.added).toBe(1);
      expect(result.skipped).toBe(0);
      expect(result.total).toBe(1);
    });

    it('should skip existing students', async () => {
      mockEnrollmentRepository.find.mockResolvedValue([mockEnrollment]);
      mockUserRepository.findBy.mockResolvedValue([mockUser]);
      mockRepository.find.mockResolvedValue([mockStudentList]);
      mockRepository.findOne.mockResolvedValue(mockStudentList);

      const result = await service.importStudentsFromClass(1, 1);
      expect(result.added).toBe(0);
      expect(result.skipped).toBe(1);
    });

    it('should throw error when no students in class', async () => {
      mockEnrollmentRepository.find.mockResolvedValue([]);
      await expect(service.importStudentsFromClass(1, 1)).rejects.toThrow();
    });
  });
});
