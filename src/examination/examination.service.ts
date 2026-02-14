import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateExaminationDto } from './dto/create-examination.dto';
import { UpdateExaminationDto } from './dto/update-examination.dto';
import { Examination, ExaminationStatus } from './entities/examination.entity';
import { QueryExaminationDto } from './dto/query-examination.dto';

/**
 * 状态转换映射：当前状态 -> 允许转换到的新状态
 */
const ALLOWED_TRANSITIONS: Record<ExaminationStatus, ExaminationStatus[]> = {
  [ExaminationStatus.NOT_STARTED]: [ExaminationStatus.IN_PROGRESS],
  [ExaminationStatus.IN_PROGRESS]: [ExaminationStatus.FINISHED],
  [ExaminationStatus.FINISHED]: [ExaminationStatus.ARCHIVED],
  [ExaminationStatus.ARCHIVED]: [],
};

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

  /**
   * 验证状态转换是否合法
   */
  private validateTransition(
    currentStatus: ExaminationStatus,
    newStatus: ExaminationStatus,
  ): void {
    const allowedTransitions = ALLOWED_TRANSITIONS[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid state transition: cannot transition from ${ExaminationStatus[currentStatus]} to ${ExaminationStatus[newStatus]}`,
      );
    }
  }

  /**
   * 开始考试：将状态从 NOT_STARTED 转换为 IN_PROGRESS
   */
  async start(id: number): Promise<Examination> {
    const examination = await this.findOne(id);
    if (!examination) {
      throw new BadRequestException(`Examination with id ${id} not found`);
    }

    this.validateTransition(examination.status, ExaminationStatus.IN_PROGRESS);
    examination.status = ExaminationStatus.IN_PROGRESS;

    return this.examinationRepository.save(examination);
  }

  /**
   * 结束考试：将状态从 IN_PROGRESS 转换为 FINISHED
   */
  async end(id: number): Promise<Examination> {
    const examination = await this.findOne(id);
    if (!examination) {
      throw new BadRequestException(`Examination with id ${id} not found`);
    }

    this.validateTransition(examination.status, ExaminationStatus.FINISHED);
    examination.status = ExaminationStatus.FINISHED;

    return this.examinationRepository.save(examination);
  }

  /**
   * 归档考试：将状态从 FINISHED 转换为 ARCHIVED
   */
  async archive(id: number): Promise<Examination> {
    const examination = await this.findOne(id);
    if (!examination) {
      throw new BadRequestException(`Examination with id ${id} not found`);
    }

    this.validateTransition(examination.status, ExaminationStatus.ARCHIVED);
    examination.status = ExaminationStatus.ARCHIVED;

    return this.examinationRepository.save(examination);
  }
}
