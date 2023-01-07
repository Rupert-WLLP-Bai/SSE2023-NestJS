import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
import { Experiment } from './entities/experiment.entity';

@Injectable()
export class ExperimentService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
  ) {}
  create(createExperimentDto: CreateExperimentDto) {
    return this.experimentRepository.save(createExperimentDto);
  }

  findAll() {
    return this.experimentRepository.find();
  }

  findOne(id: number) {
    return this.experimentRepository.findOneBy({ id: id });
  }

  update(id: number, updateExperimentDto: UpdateExperimentDto) {
    return this.experimentRepository.update(id, updateExperimentDto);
  }

  remove(id: number) {
    return this.experimentRepository.delete(id);
  }
}
