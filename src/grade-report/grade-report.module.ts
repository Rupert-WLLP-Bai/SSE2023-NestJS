import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeReportController } from './grade-report.controller';
import { GradeReportService } from './grade-report.service';
import { TotalScore } from '../total_score/entities/total_score.entity';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { ExperimentScore } from '../experiment_score/entities/experiment_score.entity';
import { ExperimentWeight } from '../experiment_weight/entities/experiment_weight.entity';
import { ExaminationScore } from '../examination_score/entities/examination_score.entity';
import { ExaminationWeight } from '../examination_weight/entities/examination_weight.entity';
import { User } from '../user/entities/user.entity';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { CourseModule } from '../course/course.module';
import { CourseService } from '../course/course.service';
import { Experiment } from '../experiment/entities/experiment.entity';
import { Examination } from '../examination/entities/examination.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Course } from '../course/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TotalScore,
      TotalWeight,
      ExperimentScore,
      ExperimentWeight,
      ExaminationScore,
      ExaminationWeight,
      User,
      Experiment,
      Examination,
      Enrollment,
      Course,
    ]),
    EnrollmentModule,
    CourseModule,
  ],
  controllers: [GradeReportController],
  providers: [GradeReportService, EnrollmentService, CourseService],
  exports: [GradeReportService],
})
export class GradeReportModule {}
