import { Injectable } from '@nestjs/common';
import { CreateExperimentScoreDto } from './dto/create-experiment_score.dto';
import { UpdateExperimentScoreDto } from './dto/update-experiment_score.dto';

@Injectable()
export class ExperimentScoreService {
  create(createExperimentScoreDto: CreateExperimentScoreDto) {
    return 'This action adds a new experimentScore';
  }

  findAll() {
    return `This action returns all experimentScore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} experimentScore`;
  }

  update(id: number, updateExperimentScoreDto: UpdateExperimentScoreDto) {
    return `This action updates a #${id} experimentScore`;
  }

  remove(id: number) {
    return `This action removes a #${id} experimentScore`;
  }
}
