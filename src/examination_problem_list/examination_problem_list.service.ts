import { Injectable } from '@nestjs/common';
import { CreateExaminationProblemListDto } from './dto/create-examination_problem_list.dto';
import { UpdateExaminationProblemListDto } from './dto/update-examination_problem_list.dto';

@Injectable()
export class ExaminationProblemListService {
  create(createExaminationProblemListDto: CreateExaminationProblemListDto) {
    return 'This action adds a new examinationProblemList';
  }

  findAll() {
    return `This action returns all examinationProblemList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examinationProblemList`;
  }

  update(
    id: number,
    updateExaminationProblemListDto: UpdateExaminationProblemListDto,
  ) {
    return `This action updates a #${id} examinationProblemList`;
  }

  remove(id: number) {
    return `This action removes a #${id} examinationProblemList`;
  }
}
