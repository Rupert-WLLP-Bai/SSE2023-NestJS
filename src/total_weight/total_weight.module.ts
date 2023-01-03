import { Module } from '@nestjs/common';
import { TotalWeightService } from './total_weight.service';
import { TotalWeightController } from './total_weight.controller';

@Module({
  controllers: [TotalWeightController],
  providers: [TotalWeightService]
})
export class TotalWeightModule {}
