import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaminationStudentListService } from './examination_student_list.service';
import { ExaminationStudentListController } from './examination_student_list.controller';
import { ExaminationStudentList } from './entities/examination_student_list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExaminationStudentList])],
  controllers: [ExaminationStudentListController],
  providers: [ExaminationStudentListService],
  exports: [ExaminationStudentListService],
})
export class ExaminationStudentListModule {}
