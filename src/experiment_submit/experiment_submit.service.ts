import { Injectable } from '@nestjs/common';
import { CreateExperimentSubmitDto } from './dto/create-experiment_submit.dto';
import { UpdateExperimentSubmitDto } from './dto/update-experiment_submit.dto';

@Injectable()
export class ExperimentSubmitService {
  create(createExperimentSubmitDto: CreateExperimentSubmitDto) {
    return 'This action adds a new experimentSubmit';
  }

  findAll() {
    return `This action returns all experimentSubmit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} experimentSubmit`;
  }

  update(id: number, updateExperimentSubmitDto: UpdateExperimentSubmitDto) {
    return `This action updates a #${id} experimentSubmit`;
  }

  remove(id: number) {
    return `This action removes a #${id} experimentSubmit`;
  }
}
