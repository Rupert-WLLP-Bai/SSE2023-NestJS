import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExperimentSubmitDto } from './dto/create-experiment_submit.dto';
import { QueryExperimentSubmitDto } from './dto/query-experiment_submit-dto';
import { UpdateExperimentSubmitDto } from './dto/update-experiment_submit.dto';
import { ExperimentSubmit } from './entities/experiment_submit.entity';

@Injectable()
export class ExperimentSubmitService {
  constructor(
    @InjectRepository(ExperimentSubmit)
    private readonly experimentSubmitRepository: Repository<ExperimentSubmit>,
  ) {}
  create(createExperimentSubmitDto: CreateExperimentSubmitDto) {
    return this.experimentSubmitRepository.save(createExperimentSubmitDto);
  }

  findAll() {
    return this.experimentSubmitRepository.find();
  }

  findOne(id: number) {
    return this.experimentSubmitRepository.findOneBy({ id: id });
  }

  update(id: number, updateExperimentSubmitDto: UpdateExperimentSubmitDto) {
    return this.experimentSubmitRepository.update(
      id,
      updateExperimentSubmitDto,
    );
  }

  remove(id: number) {
    return this.experimentSubmitRepository.delete(id);
  }

  async findCommon(
    queryExperimentSubmitDto: QueryExperimentSubmitDto,
  ): Promise<[ExperimentSubmit[], number]> {
    const { page, limit, sort, order, filter } = queryExperimentSubmitDto;
    const take = limit;
    const skip = (page - 1) * limit;
    const res = await this.experimentSubmitRepository.findAndCount({
      take: take,
      skip: skip,
      order: {
        [sort]: order,
      },
      where: {
        ...filter,
      },
    });
    const data = res[0];
    const total = res[1];
    // this.logger.debug('total = ' + total);
    return [data, total];
  }
}
