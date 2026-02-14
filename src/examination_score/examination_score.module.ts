import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaminationScoreService } from './examination_score.service';
import { ExaminationScoreController } from './examination_score.controller';
import { ExaminationScore } from './entities/examination_score.entity';
import { ExaminationSubmitModule } from '../examination_submit/examination_submit.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExaminationScore]),
    ExaminationSubmitModule,
    AuditModule,
  ],
  controllers: [ExaminationScoreController],
  providers: [ExaminationScoreService],
  exports: [ExaminationScoreService],
})
export class ExaminationScoreModule {}
