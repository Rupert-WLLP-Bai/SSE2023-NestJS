import { Module } from '@nestjs/common';
import { ExperimentScoreService } from './experiment_score.service';
import { ExperimentScoreController } from './experiment_score.controller';

@Module({
  controllers: [ExperimentScoreController],
  providers: [ExperimentScoreService],
})
export class ExperimentScoreModule {}
