import { Module } from '@nestjs/common';
import { ExperimentSubmitService } from './experiment_submit.service';
import { ExperimentSubmitController } from './experiment_submit.controller';

@Module({
  controllers: [ExperimentSubmitController],
  providers: [ExperimentSubmitService]
})
export class ExperimentSubmitModule {}
