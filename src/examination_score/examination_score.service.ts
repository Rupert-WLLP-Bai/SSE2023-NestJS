import { Injectable } from '@nestjs/common';
import { CreateExaminationScoreDto } from './dto/create-examination_score.dto';
import { UpdateExaminationScoreDto } from './dto/update-examination_score.dto';

@Injectable()
export class ExaminationScoreService {
  create(createExaminationScoreDto: CreateExaminationScoreDto) {
    return 'This action adds a new examinationScore';
  }

  findAll() {
    return `This action returns all examinationScore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examinationScore`;
  }

  update(id: number, updateExaminationScoreDto: UpdateExaminationScoreDto) {
    return `This action updates a #${id} examinationScore`;
  }

  remove(id: number) {
    return `This action removes a #${id} examinationScore`;
  }
}
