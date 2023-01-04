import { Module } from '@nestjs/common';
import { ExaminationStudentListService } from './examination_student_list.service';
import { ExaminationStudentListController } from './examination_student_list.controller';

@Module({
  controllers: [ExaminationStudentListController],
  providers: [ExaminationStudentListService],
})
export class ExaminationStudentListModule {}
