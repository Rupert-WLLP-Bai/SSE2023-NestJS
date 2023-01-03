import { Injectable } from '@nestjs/common';
import { CreateExaminationWeightDto } from './dto/create-examination_weight.dto';
import { UpdateExaminationWeightDto } from './dto/update-examination_weight.dto';

@Injectable()
export class ExaminationWeightService {
  create(createExaminationWeightDto: CreateExaminationWeightDto) {
    return 'This action adds a new examinationWeight';
  }

  findAll() {
    return `This action returns all examinationWeight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examinationWeight`;
  }

  update(id: number, updateExaminationWeightDto: UpdateExaminationWeightDto) {
    return `This action updates a #${id} examinationWeight`;
  }

  remove(id: number) {
    return `This action removes a #${id} examinationWeight`;
  }
}
