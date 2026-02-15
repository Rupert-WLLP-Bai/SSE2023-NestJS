import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaminationWeightService } from './examination_weight.service';
import { ExaminationWeightController } from './examination_weight.controller';
import { ExaminationWeight } from './entities/examination_weight.entity';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExaminationWeight, TotalWeight]),
    AuditModule,
  ],
  controllers: [ExaminationWeightController],
  providers: [ExaminationWeightService],
  exports: [ExaminationWeightService],
})
export class ExaminationWeightModule {}
