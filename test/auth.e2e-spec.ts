import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

import { User, UserRole, UserStatus } from '../src/user/entities/user.entity';
import { Course } from '../src/course/entities/course.entity';
import { LoginModule } from '../src/login/login.module';
import { UserModule } from '../src/user/user.module';
import { CourseModule } from '../src/course/course.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../src/common/strategies/jwt.strategy';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { TransformInterceptor } from '../src/common/interceptors/success.interceptor';

const JWT_SECRET = 'test-secret-for-e2e';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const currentTime = new Date();

  beforeAll(async () => {
    process.env.JWT_SECRET = JWT_SECRET;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot([
          {
            name: 'short',
            ttl: 60000,
            limit: 10,
          },
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '7d' },
        }),
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [User, Course],
          synchronize: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([User, Course]),
        LoginModule,
        UserModule,
        CourseModule,
      ],
      providers: [JwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  // 创建测试用户数据
  const createTestUser = async (
    id: number,
    name: string,
    role: UserRole,
    password: string = '123456',
  ): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      id,
      name,
      password: hashedPassword,
      role,
      status: UserStatus.ENABLE,
      email: `${id}@example.com`,
      phone: '13800138000',
      create_time: currentTime,
      update_time: currentTime,
    });
    return userRepository.save(user);
  };

  describe('Login', () => {
    it('should login successfully with correct credentials', async () => {
      // 创建测试用户
      await createTestUser(2052526, '张三', UserRole.STUDENT);

      const loginDto = {
        id: 2052526,
        password: '123456',
      };

      const response = await request(app.getHttpServer())
        .post('/login/account')
        .send(loginDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('currentAuthority');
      expect(response.body.data.currentAuthority).toBe('student');
    });

    it('should fail login with wrong password', async () => {
      // 用户已存在，直接测试
      const loginDto = {
        id: 2052526,
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/login/account')
        .send(loginDto)
        .expect(201);

      expect(response.body.success).toBe(false);
      expect(response.body.errorCode).toBe('10002');
    });

    it('should fail login with non-existent user', async () => {
      const loginDto = {
        id: 9999999,
        password: '123456',
      };

      const response = await request(app.getHttpServer())
        .post('/login/account')
        .send(loginDto)
        .expect(201);

      expect(response.body.success).toBe(false);
      expect(response.body.errorCode).toBe('10001');
    });

    it('should login as teacher successfully', async () => {
      await createTestUser(1001, '李老师', UserRole.TEACHER);

      const loginDto = {
        id: 1001,
        password: '123456',
      };

      const response = await request(app.getHttpServer())
        .post('/login/account')
        .send(loginDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.currentAuthority).toBe('teacher');
    });
  });

  describe('JWT Token', () => {
    it('should generate valid JWT token', () => {
      const payload = { sub: 2052526, id: 2052526, role: 1 };
      const token = jwtService.sign(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should verify valid JWT token', async () => {
      const payload = { sub: 2052526, id: 2052526, role: 1 };
      const token = jwtService.sign(payload);
      const decoded = jwtService.verify(token);

      expect(decoded.sub).toBe(2052526);
      expect(decoded.id).toBe(2052526);
      expect(decoded.role).toBe(1);
    });

    it('should reject invalid JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get('/course')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toBeDefined();
    });
  });

  describe('Protected Routes', () => {
    beforeAll(async () => {
      // 为后续测试创建更多用户
      await createTestUser(2052527, '李四', UserRole.STUDENT);
      await createTestUser(1002, '王老师', UserRole.TEACHER);
    });

    it('should reject access without token (unauthenticated)', async () => {
      const response = await request(app.getHttpServer())
        .get('/course')
        .expect(401);

      expect(response.body).toBeDefined();
    });

    it('should reject access with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/course')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toBeDefined();
    });
  });

  describe('Outlogin', () => {
    it('should logout successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/login/outlogin')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
