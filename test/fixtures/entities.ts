import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../../src/user/entities/user.entity';
import { Course } from '../../src/course/entities/course.entity';
import { Class } from '../../src/class/entities/class.entity';
import { Enrollment } from '../../src/enrollment/entities/enrollment.entity';
import { Examination } from '../../src/examination/entities/examination.entity';
import { ExaminationStudentList } from '../../src/examination_student_list/entities/examination_student_list.entity';
import { ExaminationSubmit } from '../../src/examination_submit/entities/examination_submit.entity';
import { ExaminationScore } from '../../src/examination_score/entities/examination_score.entity';
import { TotalScore } from '../../src/total_score/entities/total_score.entity';
import { TotalWeight } from '../../src/total_weight/entities/total_weight.entity';
import { ExaminationWeight } from '../../src/examination_weight/entities/examination_weight.entity';

export interface UserFixtureOptions {
  id?: number;
  name?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  email?: string;
  phone?: string;
}

export interface CourseFixtureOptions {
  id?: number;
  name?: string;
  code?: string;
  description?: string;
  teacherId?: number;
  teacherName?: string;
  credit?: number;
}

export interface ClassFixtureOptions {
  id?: number;
  name?: string;
  courseId?: number;
  teacherId?: number;
  teacherName?: string;
  maxStudents?: number;
  currentStudents?: number;
}

export interface EnrollmentFixtureOptions {
  id?: number;
  studentId?: number;
  studentName?: string;
  classId?: number;
  className?: string;
  courseId?: number;
  courseName?: string;
  status?: string;
}

export interface ExaminationFixtureOptions {
  id?: number;
  title?: string;
  description?: string;
  courseId?: number;
  courseName?: string;
  publisherId?: number;
  publisherName?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  totalScore?: number;
  passingScore?: number;
  status?: number;
  type?: string;
}

export interface ExaminationStudentListFixtureOptions {
  id?: number;
  examinationId?: number;
  studentId?: number;
  studentName?: string;
  status?: string;
}

export interface ExaminationSubmitFixtureOptions {
  id?: number;
  examinationId?: number;
  studentId?: number;
  problemId?: number;
  status?: string;
  score?: number | null;
  createTime?: Date;
  updateTime?: Date;
}

export interface ExaminationScoreFixtureOptions {
  id?: number;
  examinationId?: number;
  studentId?: number;
  problemId?: number;
  score?: number;
  gradedBy?: number;
  status?: string;
}

export interface TotalScoreFixtureOptions {
  id?: number;
  studentId?: number;
  studentName?: string;
  courseId?: number;
  courseName?: string;
  classId?: number;
  className?: string;
  experimentScore?: number;
  experimentWeight?: number;
  examinationScore?: number;
  examinationWeight?: number;
  totalScore?: number;
  status?: string;
  gradedBy?: number;
}

export interface TotalWeightFixtureOptions {
  id?: number;
  courseId?: number;
  experimentWeight?: number;
  examinationWeight?: number;
}

export interface ExaminationWeightFixtureOptions {
  id?: number;
  courseId?: number;
  examinationId?: number;
  weight?: number;
}

// 用户工厂函数
export async function createUser(options: UserFixtureOptions = {}): Promise<User> {
  const hashedPassword = await bcrypt.hash(options.password || '123456', 10);
  return {
    id: options.id || 2052500 + Math.floor(Math.random() * 1000),
    name: options.name || 'Test User',
    password: hashedPassword,
    role: options.role || UserRole.STUDENT,
    status: options.status || UserStatus.ENABLE,
    email: options.email || 'test@example.com',
    phone: options.phone || '13800138000',
    create_time: new Date(),
    update_time: new Date(),
    last_login_time: null,
    ip: null,
  } as User;
}

// 教师工厂函数
export async function createTeacher(options: UserFixtureOptions = {}): Promise<User> {
  return createUser({
    ...options,
    role: UserRole.TEACHER,
    id: options.id || 1001,
    name: options.name || 'Teacher Li',
  });
}

// 学生工厂函数
export async function createStudent(options: UserFixtureOptions = {}): Promise<User> {
  return createUser({
    ...options,
    role: UserRole.STUDENT,
    id: options.id || 2052526,
    name: options.name || 'Student Zhang',
  });
}

// 课程工厂函数
export function createCourse(options: CourseFixtureOptions = {}): Course {
  const now = new Date();
  return {
    id: options.id || 1,
    name: options.name || '数据结构',
    code: options.code || 'CS301',
    description: options.description || '数据结构课程',
    teacherId: options.teacherId || 1001,
    teacherName: options.teacherName || '李老师',
    credit: options.credit || 3,
    createTime: now,
    updateTime: now,
  } as Course;
}

// 班级工厂函数
export function createClass(options: ClassFixtureOptions = {}): Class {
  const now = new Date();
  return {
    id: options.id || 1,
    name: options.name || '计算机21级1班',
    courseId: options.courseId || 1,
    teacherId: options.teacherId || 1001,
    teacherName: options.teacherName || '李老师',
    maxStudents: options.maxStudents || 60,
    currentStudents: options.currentStudents || 0,
    createTime: now,
    updateTime: now,
  } as Class;
}

// 选课工厂函数
export function createEnrollment(options: EnrollmentFixtureOptions = {}): Enrollment {
  const now = new Date();
  return {
    id: options.id || 1,
    studentId: options.studentId || 2052526,
    studentName: options.studentName || '张三',
    classId: options.classId || 1,
    className: options.className || '计算机21级1班',
    courseId: options.courseId || 1,
    courseName: options.courseName || '数据结构',
    status: options.status || 'active',
    enrollmentDate: now,
    createTime: now,
    updateTime: now,
  } as Enrollment;
}

// 考试工厂函数
export function createExamination(options: ExaminationFixtureOptions = {}): Examination {
  const now = options.startTime || new Date();
  const endTime = options.endTime || new Date(now.getTime() + 7200000);
  return {
    id: options.id || 1,
    title: options.title || '期末考试',
    description: options.description || '期末考试',
    courseId: options.courseId || 1,
    courseName: options.courseName || '数据结构',
    publisherId: options.publisherId || 1001,
    publisherName: options.publisherName || '李老师',
    startTime: now,
    endTime: endTime,
    duration: options.duration || 120,
    totalScore: options.totalScore || 100,
    passingScore: options.passingScore || 60,
    status: options.status || 0,
    type: options.type || 'online',
    createTime: now,
    updateTime: now,
  } as Examination;
}

// 考生列表工厂函数
export function createExaminationStudentList(
  options: ExaminationStudentListFixtureOptions,
): ExaminationStudentList {
  return {
    id: options.id || 1,
    examinationId: options.examinationId || 1,
    studentId: options.studentId || 2052526,
    studentName: options.studentName || '张三',
    status: options.status || 'registered',
  } as ExaminationStudentList;
}

// 考试提交工厂函数
export function createExaminationSubmit(
  options: ExaminationSubmitFixtureOptions,
): ExaminationSubmit {
  const now = options.createTime || new Date();
  return {
    id: options.id || 1,
    examinationId: options.examinationId || 1,
    studentId: options.studentId || 2052526,
    problemId: options.problemId || 1,
    status: options.status || 'submitted',
    score: options.score ?? null,
    createTime: now,
    updateTime: options.updateTime || now,
  } as ExaminationSubmit;
}

// 考试成绩工厂函数
export function createExaminationScore(
  options: ExaminationScoreFixtureOptions,
): ExaminationScore {
  return {
    id: options.id || 1,
    examinationId: options.examinationId || 1,
    studentId: options.studentId || 2052526,
    problemId: options.problemId || 1,
    score: options.score || 85,
    gradedBy: options.gradedBy || 1001,
    status: options.status || 'graded',
  } as ExaminationScore;
}

// 总分工厂函数
export function createTotalScore(options: TotalScoreFixtureOptions = {}): TotalScore {
  return {
    id: options.id || 1,
    studentId: options.studentId || 2052526,
    studentName: options.studentName || '张三',
    courseId: options.courseId || 1,
    courseName: options.courseName || '数据结构',
    classId: options.classId || 1,
    className: options.className || '计算机21级1班',
    experimentScore: options.experimentScore || 80,
    experimentWeight: options.experimentWeight || 40,
    examinationScore: options.examinationScore || 85,
    examinationWeight: options.examinationWeight || 60,
    totalScore: options.totalScore || 83,
    status: options.status || 'graded',
    gradedBy: options.gradedBy || 1001,
    createTime: new Date(),
    updateTime: new Date(),
  } as TotalScore;
}

// 总权重工厂函数
export function createTotalWeight(options: TotalWeightFixtureOptions = {}): TotalWeight {
  return {
    id: options.id || 1,
    courseId: options.courseId || 1,
    experimentWeight: options.experimentWeight || 40,
    examinationWeight: options.examinationWeight || 60,
    createTime: new Date(),
    updateTime: new Date(),
  } as TotalWeight;
}

// 考试权重工厂函数
export function createExaminationWeight(
  options: ExaminationWeightFixtureOptions,
): ExaminationWeight {
  return {
    id: options.id || 1,
    courseId: options.courseId || 1,
    examinationId: options.examinationId || 1,
    weight: options.weight || 60,
    createTime: new Date(),
    updateTime: new Date(),
  } as ExaminationWeight;
}

// 清除所有表数据
export async function clearAllTables(repositories: any[]): Promise<void> {
  for (const repo of repositories) {
    if (repo && typeof repo.clear === 'function') {
      await repo.clear();
    }
  }
}
