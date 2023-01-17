import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ExperimentSubmitService } from './experiment_submit.service';
import { ExperimentSubmitController } from './experiment_submit.controller';
import { ExperimentSubmit } from './entities/experiment_submit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExperimentSubmit])],
  controllers: [ExperimentSubmitController],
  providers: [ExperimentSubmitService],
  exports: [ExperimentSubmitService],
})
export class ExperimentSubmitModule {}
