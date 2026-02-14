import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaminationSubmitService } from './examination_submit.service';
import { ExaminationSubmitController } from './examination_submit.controller';
import { ExaminationSubmit } from './entities/examination_submit.entity';
import { Examination } from '../examination/entities/examination.entity';
import { ExaminationModule } from '../examination/examination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExaminationSubmit, Examination]),
    ExaminationModule,
  ],
  controllers: [ExaminationSubmitController],
  providers: [ExaminationSubmitService],
  exports: [ExaminationSubmitService],
})
export class ExaminationSubmitModule {}
