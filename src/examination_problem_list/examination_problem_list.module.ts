import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaminationProblemListService } from './examination_problem_list.service';
import { ExaminationProblemListController } from './examination_problem_list.controller';
import { ExaminationProblemList } from './entities/examination_problem_list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExaminationProblemList])],
  controllers: [ExaminationProblemListController],
  providers: [ExaminationProblemListService],
  exports: [ExaminationProblemListService],
})
export class ExaminationProblemListModule {}
