import { Module } from '@nestjs/common';
import { ExperimentWeightService } from './experiment_weight.service';
import { ExperimentWeightController } from './experiment_weight.controller';

@Module({
  controllers: [ExperimentWeightController],
  providers: [ExperimentWeightService]
})
export class ExperimentWeightModule {}
