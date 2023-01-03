import { Injectable } from '@nestjs/common';
import { CreateExaminationDto } from './dto/create-examination.dto';
import { UpdateExaminationDto } from './dto/update-examination.dto';

@Injectable()
export class ExaminationService {
  create(createExaminationDto: CreateExaminationDto) {
    return 'This action adds a new examination';
  }

  findAll() {
    return `This action returns all examination`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examination`;
  }

  update(id: number, updateExaminationDto: UpdateExaminationDto) {
    return `This action updates a #${id} examination`;
  }

  remove(id: number) {
    return `This action removes a #${id} examination`;
  }
}
