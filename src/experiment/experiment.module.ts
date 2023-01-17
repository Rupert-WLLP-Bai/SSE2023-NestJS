import { ExperimentSubmitService } from './../experiment_submit/experiment_submit.service';
import { Module } from '@nestjs/common';
import { ExperimentService } from './experiment.service';
import { ExperimentController } from './experiment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';
import { ExperimentSubmit } from '../experiment_submit/entities/experiment_submit.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment, ExperimentSubmit])],
  controllers: [ExperimentController],
  providers: [ExperimentService, ExperimentSubmitService],
  exports: [ExperimentService],
})
export class ExperimentModule {}
