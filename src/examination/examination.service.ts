import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateExaminationDto } from './dto/create-examination.dto';
import { UpdateExaminationDto } from './dto/update-examination.dto';
import { Examination } from './entities/examination.entity';
import { QueryExaminationDto } from './dto/query-examination.dto';

@Injectable()
export class ExaminationService {
  constructor(
    @InjectRepository(Examination)
    private readonly examinationRepository: Repository<Examination>,
  ) {}
  private readonly logger = new Logger(ExaminationService.name);

  async create(createExaminationDto: CreateExaminationDto): Promise<Examination> {
    const examination = this.examinationRepository.create(createExaminationDto);
    return this.examinationRepository.save(examination);
  }

  async findAll(): Promise<Examination[]> {
    return this.examinationRepository.find();
  }

  async findAndCount(): Promise<[Examination[], number]> {
    return this.examinationRepository.findAndCount();
  }

  async findOne(id: number): Promise<Examination | null> {
    return this.examinationRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateExaminationDto: UpdateExaminationDto,
  ): Promise<UpdateResult> {
    return this.examinationRepository.update(id, updateExaminationDto);
  }

  async remove(id: number): Promise<void> {
    await this.examinationRepository.delete(id);
  }

  async findPage(
    page: number,
    pageSize: number,
  ): Promise<[Examination[], number]> {
    const take = pageSize;
    const skip = (page - 1) * pageSize;
    return this.examinationRepository.findAndCount({
      take,
      skip,
    });
  }

  async findCommon(
    queryExaminationDto: QueryExaminationDto,
  ): Promise<[Examination[], number]> {
    const { page, limit, sort, order, filter } = queryExaminationDto;
    this.logger.log(JSON.stringify(queryExaminationDto));
    const take = limit;
    const skip = (page - 1) * limit;
    return this.examinationRepository.findAndCount({
      take,
      skip,
      order: {
        [sort || 'id']: order || 'DESC',
      },
      where: filter,
    });
  }
}
