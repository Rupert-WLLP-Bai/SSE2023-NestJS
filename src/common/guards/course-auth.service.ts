import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { UserRole } from '../../user/entities/user.entity';

export interface CourseOwnershipContext {
  userId: number;
  userRole: number;
  courseId: number;
}

@Injectable()
export class CourseAuthService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  /**
   * 校验用户是否有权限操作指定课程的数据
   * - 管理员 (role=0) 可以操作所有课程
   * - 教师 (role=2) 只能操作自己教授的课程
   * - 助教 (role=3) 只能操作自己教授的课程
   * - 学生 (role=1) 无权操作课程数据
   */
  async validateCourseOwnership(
    context: CourseOwnershipContext,
  ): Promise<boolean> {
    const { userId, userRole, courseId } = context;

    // 管理员可以绕过课程归属限制
    if (userRole === UserRole.ADMIN) {
      return true;
    }

    // 学生无权操作课程数据
    if (userRole === UserRole.STUDENT) {
      throw new ForbiddenException({
        success: false,
        errorCode: 'FORBIDDEN',
        errorMessage: '无权访问：学生角色无权操作课程数据',
        showType: 2,
      });
    }

    // 教师和助教只能操作自己教授的课程
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new ForbiddenException({
        success: false,
        errorCode: 'FORBIDDEN',
        errorMessage: '无权访问：课程不存在',
        showType: 2,
      });
    }

    if (course.teacherId !== userId) {
      throw new ForbiddenException({
        success: false,
        errorCode: 'FORBIDDEN',
        errorMessage: '无权访问：您不是该课程的授课教师',
        showType: 2,
      });
    }

    return true;
  }
}
