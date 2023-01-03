import { Injectable } from '@nestjs/common';
import { CreateExperimentWeightDto } from './dto/create-experiment_weight.dto';
import { UpdateExperimentWeightDto } from './dto/update-experiment_weight.dto';

@Injectable()
export class ExperimentWeightService {
  create(createExperimentWeightDto: CreateExperimentWeightDto) {
    return 'This action adds a new experimentWeight';
  }

  findAll() {
    return `This action returns all experimentWeight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} experimentWeight`;
  }

  update(id: number, updateExperimentWeightDto: UpdateExperimentWeightDto) {
    return `This action updates a #${id} experimentWeight`;
  }

  remove(id: number) {
    return `This action removes a #${id} experimentWeight`;
  }
}
