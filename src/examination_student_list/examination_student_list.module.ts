import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaminationStudentListService } from './examination_student_list.service';
import { ExaminationStudentListController } from './examination_student_list.controller';
import { ExaminationStudentList } from './entities/examination_student_list.entity';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExaminationStudentList, Enrollment, User]),
    EnrollmentModule,
    UserModule,
  ],
  controllers: [ExaminationStudentListController],
  providers: [ExaminationStudentListService, EnrollmentService, UserService],
  exports: [ExaminationStudentListService],
})
export class ExaminationStudentListModule {}
