import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentWeightService } from './experiment_weight.service';
import { ExperimentWeightController } from './experiment_weight.controller';
import { ExperimentWeight } from './entities/experiment_weight.entity';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExperimentWeight, TotalWeight]),
    AuditModule,
  ],
  controllers: [ExperimentWeightController],
  providers: [ExperimentWeightService],
  exports: [ExperimentWeightService],
})
export class ExperimentWeightModule {}
