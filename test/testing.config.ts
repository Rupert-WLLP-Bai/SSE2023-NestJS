import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../src/common/strategies/jwt.strategy';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { TransformInterceptor } from '../src/common/interceptors/success.interceptor';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

// 导入所有实体
import { Course } from '../src/course/entities/course.entity';
import { Class } from '../src/class/entities/class.entity';
import { Enrollment } from '../src/enrollment/entities/enrollment.entity';
import { User } from '../src/user/entities/user.entity';
import { Examination } from '../src/examination/entities/examination.entity';
import { ExaminationStudentList } from '../src/examination_student_list/entities/examination_student_list.entity';
import { ExaminationSubmit } from '../src/examination_submit/entities/examination_submit.entity';
import { ExaminationScore } from '../src/examination_score/entities/examination_score.entity';
import { TotalScore } from '../src/total_score/entities/total_score.entity';
import { TotalWeight } from '../src/total_weight/entities/total_weight.entity';
import { ExaminationWeight } from '../src/examination_weight/entities/examination_weight.entity';
import { Experiment } from '../src/experiment/entities/experiment.entity';
import { ExperimentScore } from '../src/experiment_score/entities/experiment_score.entity';
import { ExperimentWeight } from '../src/experiment_weight/entities/experiment_weight.entity';
import { ExperimentSubmit } from '../src/experiment_submit/entities/experiment_submit.entity';
import { Notice } from '../src/notice/entities/notice.entity';

export const TEST_ENTITIES = [
  Course,
  Class,
  Enrollment,
  User,
  Examination,
  ExaminationStudentList,
  ExaminationSubmit,
  ExaminationScore,
  TotalScore,
  TotalWeight,
  ExaminationWeight,
  Experiment,
  ExperimentScore,
  ExperimentWeight,
  ExperimentSubmit,
  Notice,
];

export const JWT_SECRET = 'test-secret-for-e2e';

/**
 * 创建 SQLite 内存数据库配置
 */
export function createSqliteConfig(): TypeOrmModuleOptions {
  return {
    type: 'better-sqlite3',
    database: ':memory:',
    entities: TEST_ENTITIES,
    synchronize: true,
    autoLoadEntities: true,
  };
}

/**
 * 获取所有模块的导入配置
 */
export function getModuleImports(entities?: EntityClassOrSchema[]) {
  const entityList = entities || TEST_ENTITIES;
  return [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    } as JwtModuleOptions),
    TypeOrmModule.forRoot(createSqliteConfig()),
    TypeOrmModule.forFeature(entityList as never[]),
  ];
}

/**
 * 创建测试模块的 builder
 */
export interface TestModuleBuilder {
  withEntities(entities: EntityClassOrSchema[]): TestModuleBuilder;
  withModules(modules: any[]): TestModuleBuilder;
  withProviders(providers: any[]): TestModuleBuilder;
  build(): Promise<TestingModule>;
}

/**
 * 创建测试模块
 */
export async function createTestModule(
  entities: EntityClassOrSchema[],
  modules: any[],
  providers: any[] = [],
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
        secret: JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
      TypeOrmModule.forRoot({
        type: 'better-sqlite3',
        database: ':memory:',
        entities,
        synchronize: true,
        autoLoadEntities: true,
      }),
      TypeOrmModule.forFeature(entities as never[]),
      ...modules,
    ],
    providers: [JwtStrategy, ...providers],
  }).compile();
}

/**
 * 配置测试应用
 */
export async function configureTestApp(
  app: INestApplication,
): Promise<INestApplication> {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  return app;
}
