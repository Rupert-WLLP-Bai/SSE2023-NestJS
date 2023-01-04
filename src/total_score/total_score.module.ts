import { Module } from '@nestjs/common';
import { TotalScoreService } from './total_score.service';
import { TotalScoreController } from './total_score.controller';

@Module({
  controllers: [TotalScoreController],
  providers: [TotalScoreService],
})
export class TotalScoreModule {}
