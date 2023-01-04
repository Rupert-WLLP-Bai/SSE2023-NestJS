import { PartialType } from '@nestjs/swagger';
import { CreateExaminationStudentListDto } from './create-examination_student_list.dto';

export class UpdateExaminationStudentListDto extends PartialType(
  CreateExaminationStudentListDto,
) {}
