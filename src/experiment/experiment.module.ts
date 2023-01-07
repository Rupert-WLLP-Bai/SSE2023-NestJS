import { Module } from '@nestjs/common';
import { ExperimentService } from './experiment.service';
import { ExperimentController } from './experiment.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';

@Module({
  controllers: [ExperimentController],
  providers: [
    ExperimentService,
    {
      provide: getRepositoryToken(Experiment),
      useValue: {},
    },
  ],
})
export class ExperimentModule {}
