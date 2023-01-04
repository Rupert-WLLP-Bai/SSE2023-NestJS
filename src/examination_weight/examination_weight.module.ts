import { Module } from '@nestjs/common';
import { ExaminationWeightService } from './examination_weight.service';
import { ExaminationWeightController } from './examination_weight.controller';

@Module({
  controllers: [ExaminationWeightController],
  providers: [ExaminationWeightService],
})
export class ExaminationWeightModule {}
