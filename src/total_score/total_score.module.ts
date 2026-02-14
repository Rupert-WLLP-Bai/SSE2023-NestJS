import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalScoreService } from './total_score.service';
import { TotalScoreController } from './total_score.controller';
import { TotalScore } from './entities/total_score.entity';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { ExperimentScore } from '../experiment_score/entities/experiment_score.entity';
import { ExperimentWeight } from '../experiment_weight/entities/experiment_weight.entity';
import { ExaminationScore } from '../examination_score/entities/examination_score.entity';
import { ExaminationWeight } from '../examination_weight/entities/examination_weight.entity';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TotalScore,
      TotalWeight,
      ExperimentScore,
      ExperimentWeight,
      ExaminationScore,
      ExaminationWeight,
    ]),
    EnrollmentModule,
  ],
  controllers: [TotalScoreController],
  providers: [TotalScoreService],
  exports: [TotalScoreService],
})
export class TotalScoreModule {}
