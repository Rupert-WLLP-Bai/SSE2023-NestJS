import { Module } from '@nestjs/common';
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
import { LoginController } from './login/login.controller';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
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
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
