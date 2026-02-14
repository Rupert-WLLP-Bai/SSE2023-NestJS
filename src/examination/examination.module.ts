import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaminationService } from './examination.service';
import { ExaminationController } from './examination.controller';
import { Examination } from './entities/examination.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Examination])],
  controllers: [ExaminationController],
  providers: [ExaminationService],
  exports: [ExaminationService],
})
export class ExaminationModule {}
