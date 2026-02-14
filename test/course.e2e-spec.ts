import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { Course } from '../src/course/entities/course.entity';
import { Class } from '../src/class/entities/class.entity';
import { Enrollment } from '../src/enrollment/entities/enrollment.entity';
import { CourseModule } from '../src/course/course.module';
import { ClassModule } from '../src/class/class.module';
import { EnrollmentModule } from '../src/enrollment/enrollment.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../src/common/strategies/jwt.strategy';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { TransformInterceptor } from '../src/common/interceptors/success.interceptor';

const JWT_SECRET = 'test-secret-for-e2e';

describe('CourseController (e2e)', () => {
  let app: INestApplication;
  let courseRepository: Repository<Course>;
  let classRepository: Repository<Class>;
  let enrollmentRepository: Repository<Enrollment>;

  const currentTime = new Date();

  beforeAll(async () => {
    process.env.JWT_SECRET = JWT_SECRET;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '7d' },
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Course, Class, Enrollment],
          synchronize: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([Course, Class, Enrollment]),
        CourseModule,
        ClassModule,
        EnrollmentModule,
      ],
      providers: [JwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();

    courseRepository = moduleFixture.get<Repository<Course>>(getRepositoryToken(Course));
    classRepository = moduleFixture.get<Repository<Class>>(getRepositoryToken(Class));
    enrollmentRepository = moduleFixture.get<Repository<Enrollment>>(getRepositoryToken(Enrollment));
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  const getToken = (userId: number, role: number) => {
    const service = app.get<JwtService>(JwtService);
    return service.sign({ sub: userId, id: userId, role, name: 'test' });
  };

  describe('Course CRUD', () => {
    let courseId: number;
    let token: string;

    beforeAll(() => {
      token = getToken(1, 1);
    });

    it('should create a course', async () => {
      const createCourseDto = {
        name: '数据结构',
        code: 'CS301',
        description: '学习数据结构的基本概念和算法',
        teacherId: 1001,
        teacherName: '李老师',
        credit: 3,
        createTime: currentTime,
        updateTime: currentTime,
      };

      const response = await request(app.getHttpServer())
        .post('/course')
        .set('Authorization', `Bearer ${token}`)
        .send(createCourseDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      courseId = response.body.data.id;
    });

    it('should get course by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/course/${courseId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should update course', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/course/${courseId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '数据结构(新版)' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should delete course', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/course/${courseId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Class CRUD', () => {
    let courseId: number;
    let classId: number;
    let token: string;

    beforeAll(() => {
      token = getToken(1, 1);
    });

    beforeAll(async () => {
      const course = await courseRepository.save({
        name: '算法设计',
        code: 'CS401',
        teacherId: 1002,
        credit: 4,
        createTime: currentTime,
        updateTime: currentTime,
      });
      courseId = course.id;
    });

    it('should create a class', async () => {
      const createClassDto = {
        name: '计算机21级1班',
        courseId,
        teacherId: 1002,
        teacherName: '王老师',
        maxStudents: 60,
        createTime: currentTime,
        updateTime: currentTime,
      };

      const response = await request(app.getHttpServer())
        .post('/class')
        .set('Authorization', `Bearer ${token}`)
        .send(createClassDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      classId = response.body.data.id;
    });

    it('should query classes by course', async () => {
      const response = await request(app.getHttpServer())
        .get(`/class/course/${courseId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.list.length).toBeGreaterThan(0);
    });
  });

  describe('Enrollment', () => {
    let courseId: number;
    let classId: number;
    const studentId = 2052526;
    let token: string;

    beforeAll(() => {
      token = getToken(1, 1);
    });

    beforeAll(async () => {
      const course = await courseRepository.save({
        name: '数据库',
        code: 'CS302',
        teacherId: 1003,
        credit: 3,
        createTime: currentTime,
        updateTime: currentTime,
      });
      courseId = course.id;

      const classEntity = await classRepository.save({
        name: '数据库21级1班',
        courseId,
        teacherId: 1003,
        teacherName: '张老师',
        maxStudents: 60,
        currentStudents: 0,
        createTime: currentTime,
        updateTime: currentTime,
      });
      classId = classEntity.id;
    });

    it('should enroll student', async () => {
      const enrollmentDto = {
        studentId,
        studentName: '张三',
        classId,
        className: '数据库21级1班',
        courseId,
        courseName: '数据库',
        status: 'active',
        enrollmentDate: currentTime,
        createTime: currentTime,
        updateTime: currentTime,
      };

      const response = await request(app.getHttpServer())
        .post('/enrollment')
        .set('Authorization', `Bearer ${token}`)
        .send(enrollmentDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('active');
    });

    it('should query enrollments by student', async () => {
      const response = await request(app.getHttpServer())
        .get(`/enrollment/student/${studentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.list.length).toBeGreaterThan(0);
    });
  });
});
