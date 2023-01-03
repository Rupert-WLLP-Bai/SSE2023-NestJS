import { Module } from '@nestjs/common';
import { ExaminationSubmitService } from './examination_submit.service';
import { ExaminationSubmitController } from './examination_submit.controller';

@Module({
  controllers: [ExaminationSubmitController],
  providers: [ExaminationSubmitService]
})
export class ExaminationSubmitModule {}
