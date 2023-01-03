import { Module } from '@nestjs/common';
import { ExaminationScoreService } from './examination_score.service';
import { ExaminationScoreController } from './examination_score.controller';

@Module({
  controllers: [ExaminationScoreController],
  providers: [ExaminationScoreService]
})
export class ExaminationScoreModule {}
