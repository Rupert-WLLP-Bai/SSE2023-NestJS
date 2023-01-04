import { Module } from '@nestjs/common';
import { ExaminationService } from './examination.service';
import { ExaminationController } from './examination.controller';

@Module({
  controllers: [ExaminationController],
  providers: [ExaminationService],
})
export class ExaminationModule {}
