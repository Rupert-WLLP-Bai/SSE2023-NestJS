import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentScoreService } from './experiment_score.service';
import { ExperimentScoreController } from './experiment_score.controller';
import { AuditModule } from '../audit/audit.module';
import { ExperimentScore } from './entities/experiment_score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExperimentScore]), AuditModule],
  controllers: [ExperimentScoreController],
  providers: [ExperimentScoreService],
})
export class ExperimentScoreModule {}
