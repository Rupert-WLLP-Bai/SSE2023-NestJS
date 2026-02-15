import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExaminationWeightDto } from './dto/create-examination_weight.dto';
import { UpdateExaminationWeightDto } from './dto/update-examination_weight.dto';
import { ExaminationWeight } from './entities/examination_weight.entity';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';

@Injectable()
export class ExaminationWeightService {
  constructor(
    @InjectRepository(ExaminationWeight)
    private readonly examinationWeightRepository: Repository<ExaminationWeight>,
    @InjectRepository(TotalWeight)
    private readonly totalWeightRepository: Repository<TotalWeight>,
  ) {}

  private readonly logger = new Logger(ExaminationWeightService.name);

  /**
   * Validates that examination weights sum <= totalWeight.examinationWeight
   */
  private async validateWeightSum(
    courseId: number,
    newWeight: number,
    excludeId?: number,
  ): Promise<void> {
    // Get total weight for the course
    const totalWeight = await this.totalWeightRepository.findOneBy({
      courseId,
    });
    if (!totalWeight) {
      throw new BadRequestException({
        errorCode: 'TOTAL_WEIGHT_NOT_FOUND',
        errorMessage: `课程 ${courseId} 的总权重未设置，请先设置总权重`,
        showType: 4,
      });
    }

    // Get all examination weights for the course
    const examinationWeights = await this.examinationWeightRepository.findBy({
      courseId,
    });

    // Calculate sum of weights, excluding the current record if updating
    const currentSum = examinationWeights
      .filter((w) => w.id !== excludeId)
      .reduce((sum, w) => sum + Number(w.weight), 0);

    const newSum = currentSum + newWeight;

    if (newSum > Number(totalWeight.examinationWeight)) {
      throw new BadRequestException({
        errorCode: 'EXAMINATION_WEIGHT_EXCEEDED',
        errorMessage: `考试权重总和（${newSum}）超过课程总考试权重（${totalWeight.examinationWeight}）`,
        showType: 4,
      });
    }
  }

  async create(createExaminationWeightDto: CreateExaminationWeightDto) {
    const { courseId, weight } = createExaminationWeightDto;

    // Validate weight sum
    await this.validateWeightSum(courseId, weight);

    const newRecord = this.examinationWeightRepository.create(
      createExaminationWeightDto,
    );
    return this.examinationWeightRepository.save(newRecord);
  }

  async findAll() {
    return this.examinationWeightRepository.find();
  }

  async findOne(id: number) {
    return this.examinationWeightRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateExaminationWeightDto: UpdateExaminationWeightDto,
  ) {
    const existing = await this.examinationWeightRepository.findOneBy({ id });
    if (!existing) {
      throw new BadRequestException({
        errorCode: 'EXAMINATION_WEIGHT_NOT_FOUND',
        errorMessage: `考试权重 ID ${id} 不存在`,
        showType: 4,
      });
    }

    // Validate weight sum if weight is being updated
    if (updateExaminationWeightDto.weight !== undefined) {
      await this.validateWeightSum(
        existing.courseId,
        updateExaminationWeightDto.weight,
        id,
      );
    }

    await this.examinationWeightRepository.update(
      id,
      updateExaminationWeightDto,
    );
    return this.examinationWeightRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.examinationWeightRepository.delete(id);
  }

  /**
   * 根据课程ID查询考试权重
   */
  async findByCourse(courseId: number) {
    return this.examinationWeightRepository.findBy({ courseId });
  }

  /**
   * 根据考试ID查询权重
   */
  async findByExamination(examinationId: number) {
    return this.examinationWeightRepository.findBy({ examinationId });
  }

  /**
   * 通用查询（支持分页）
   */
  async findCommon(query: any): Promise<[ExaminationWeight[], number]> {
    const { page = 1, limit = 10, courseId, examinationId, ...filters } = query;

    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (examinationId) where.examinationId = examinationId;

    const [list, total] = await this.examinationWeightRepository.findAndCount({
      where: { ...where, ...filters },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return [list, total];
  }
}
