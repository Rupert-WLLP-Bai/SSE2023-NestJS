import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ExperimentModule } from './experiment/experiment.module';
import { ExperimentSubmitModule } from './experiment_submit/experiment_submit.module';
import { NoticeModule } from './notice/notice.module';
import { ExaminationModule } from './examination/examination.module';
import { ExaminationSubmitModule } from './examination_submit/examination_submit.module';
import { ExperimentScoreModule } from './experiment_score/experiment_score.module';
import { ExperimentWeightModule } from './experiment_weight/experiment_weight.module';
import { ExaminationScoreModule } from './examination_score/examination_score.module';
import { ExaminationWeightModule } from './examination_weight/examination_weight.module';
import { ExaminationProblemListModule } from './examination_problem_list/examination_problem_list.module';
import { ExaminationStudentListModule } from './examination_student_list/examination_student_list.module';
import { TotalScoreModule } from './total_score/total_score.module';
import { TotalWeightModule } from './total_weight/total_weight.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './login/login.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from './file/file.module';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { CourseModule } from './course/course.module';
import { ClassModule } from './class/class.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { GuardsModule } from './common/guards/guards.module';
import { AuditModule } from './audit/audit.module';
import { GradeReportModule } from './grade-report/grade-report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 限流模块配置
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1分钟
        limit: 10, // 默认每分钟10次
      },
      {
        name: 'login',
        ttl: 60000, // 1分钟
        limit: 5, // 登录每分钟5次
      },
    ]),
    UserModule,
    ExperimentModule,
    ExperimentSubmitModule,
    NoticeModule,
    ExaminationModule,
    ExaminationSubmitModule,
    ExperimentScoreModule,
    ExperimentWeightModule,
    ExaminationScoreModule,
    ExaminationWeightModule,
    ExaminationProblemListModule,
    ExaminationStudentListModule,
    TotalScoreModule,
    TotalWeightModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // 非开发环境关闭 synchronize
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: configService.get<string>('NODE_ENV') === 'production',
        migrationsTableName: 'migrations',
      }),
    }),
    LoginModule,
    MulterModule.register({
      dest: '/tmp/uploads',
    }),
    FileModule,
    CourseModule,
    ClassModule,
    EnrollmentModule,
    GuardsModule,
    AuditModule,
    GradeReportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
