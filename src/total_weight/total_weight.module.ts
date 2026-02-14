import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalWeightService } from './total_weight.service';
import { TotalWeightController } from './total_weight.controller';
import { TotalWeight } from './entities/total_weight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TotalWeight])],
  controllers: [TotalWeightController],
  providers: [TotalWeightService],
  exports: [TotalWeightService],
})
export class TotalWeightModule {}
