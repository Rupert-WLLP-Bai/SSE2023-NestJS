import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { QueryExperimentDto } from './dto/query-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
import { Experiment } from './entities/experiment.entity';

@Injectable()
export class ExperimentService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
  ) {}

  private readonly logger = new Logger(ExperimentService.name);
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

  async findCommon(
    queryNoticeDto: QueryExperimentDto,
  ): Promise<[Experiment[], number]> {
    const { page, limit, sort, order, filter } = queryNoticeDto;
    const take = limit;
    const skip = (page - 1) * limit;
    const res = await this.experimentRepository.findAndCount({
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
