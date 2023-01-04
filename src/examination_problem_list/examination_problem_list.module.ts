import { Module } from '@nestjs/common';
import { ExaminationProblemListService } from './examination_problem_list.service';
import { ExaminationProblemListController } from './examination_problem_list.controller';

@Module({
  controllers: [ExaminationProblemListController],
  providers: [ExaminationProblemListService],
})
export class ExaminationProblemListModule {}
