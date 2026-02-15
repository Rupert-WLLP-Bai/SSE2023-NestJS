import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CourseAuthService } from './course-auth.service';
import { Course } from '../../course/entities/course.entity';
import { UserRole } from '../../user/entities/user.entity';

describe('CourseAuthService', () => {
  let service: CourseAuthService;
  let mockCourseRepository: any;

  beforeEach(async () => {
    mockCourseRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseAuthService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
      ],
    }).compile();

    service = module.get<CourseAuthService>(CourseAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCourseOwnership', () => {
    const context = {
      userId: 1,
      userRole: UserRole.TEACHER,
      courseId: 100,
    };

    it('should allow admin to access any course', async () => {
      const adminContext = { ...context, userRole: UserRole.ADMIN };
      const result = await service.validateCourseOwnership(adminContext);
      expect(result).toBe(true);
      expect(mockCourseRepository.findOne).not.toHaveBeenCalled();
    });

    it('should deny student access to course data', async () => {
      const studentContext = { ...context, userRole: UserRole.STUDENT };

      await expect(
        service.validateCourseOwnership(studentContext),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow teacher to access their own course', async () => {
      mockCourseRepository.findOne.mockResolvedValue({
        id: 100,
        teacherId: 1,
        name: 'Test Course',
      });

      const result = await service.validateCourseOwnership(context);
      expect(result).toBe(true);
    });

    it('should deny teacher access to other teacher course', async () => {
      mockCourseRepository.findOne.mockResolvedValue({
        id: 100,
        teacherId: 2,
        name: 'Other Course',
      });

      await expect(service.validateCourseOwnership(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should deny access when course not found', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null);

      await expect(service.validateCourseOwnership(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow assistant to access their assigned course', async () => {
      mockCourseRepository.findOne.mockResolvedValue({
        id: 100,
        teacherId: 1,
        name: 'Test Course',
      });

      const assistantContext = { ...context, userRole: UserRole.ASSISTANT };
      const result = await service.validateCourseOwnership(assistantContext);
      expect(result).toBe(true);
    });

    it('should deny assistant access to other teacher course', async () => {
      mockCourseRepository.findOne.mockResolvedValue({
        id: 100,
        teacherId: 2,
        name: 'Other Course',
      });

      const assistantContext = { ...context, userRole: UserRole.ASSISTANT };
      await expect(
        service.validateCourseOwnership(assistantContext),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
