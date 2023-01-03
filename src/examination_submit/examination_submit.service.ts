import { Injectable } from '@nestjs/common';
import { CreateExaminationSubmitDto } from './dto/create-examination_submit.dto';
import { UpdateExaminationSubmitDto } from './dto/update-examination_submit.dto';

@Injectable()
export class ExaminationSubmitService {
  create(createExaminationSubmitDto: CreateExaminationSubmitDto) {
    return 'This action adds a new examinationSubmit';
  }

  findAll() {
    return `This action returns all examinationSubmit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examinationSubmit`;
  }

  update(id: number, updateExaminationSubmitDto: UpdateExaminationSubmitDto) {
    return `This action updates a #${id} examinationSubmit`;
  }

  remove(id: number) {
    return `This action removes a #${id} examinationSubmit`;
  }
}
