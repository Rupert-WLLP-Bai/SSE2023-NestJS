import { Injectable } from '@nestjs/common';
import { CreateExaminationStudentListDto } from './dto/create-examination_student_list.dto';
import { UpdateExaminationStudentListDto } from './dto/update-examination_student_list.dto';

@Injectable()
export class ExaminationStudentListService {
  create(createExaminationStudentListDto: CreateExaminationStudentListDto) {
    return 'This action adds a new examinationStudentList';
  }

  findAll() {
    return `This action returns all examinationStudentList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examinationStudentList`;
  }

  update(
    id: number,
    updateExaminationStudentListDto: UpdateExaminationStudentListDto,
  ) {
    return `This action updates a #${id} examinationStudentList`;
  }

  remove(id: number) {
    return `This action removes a #${id} examinationStudentList`;
  }
}
