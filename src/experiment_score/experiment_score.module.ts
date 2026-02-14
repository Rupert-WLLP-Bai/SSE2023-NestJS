import { Module } from '@nestjs/common';
import { ExperimentScoreService } from './experiment_score.service';
import { ExperimentScoreController } from './experiment_score.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [ExperimentScoreController],
  providers: [ExperimentScoreService],
})
export class ExperimentScoreModule {}
