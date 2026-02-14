import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExperimentWeightDto } from './dto/create-experiment_weight.dto';
import { UpdateExperimentWeightDto } from './dto/update-experiment_weight.dto';
import { ExperimentWeight } from './entities/experiment_weight.entity';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';

@Injectable()
export class ExperimentWeightService {
  constructor(
    @InjectRepository(ExperimentWeight)
    private readonly experimentWeightRepository: Repository<ExperimentWeight>,
    @InjectRepository(TotalWeight)
    private readonly totalWeightRepository: Repository<TotalWeight>,
  ) {}

  private readonly logger = new Logger(ExperimentWeightService.name);

  /**
   * Validates that experiment weights sum <= totalWeight.experimentWeight
   */
  private async validateWeightSum(
    courseId: number,
    newWeight: number,
    excludeId?: number,
  ): Promise<void> {
    // Get total weight for the course
    const totalWeight = await this.totalWeightRepository.findOneBy({ courseId });
    if (!totalWeight) {
      throw new BadRequestException({
        errorCode: 'TOTAL_WEIGHT_NOT_FOUND',
        errorMessage: `课程 ${courseId} 的总权重未设置，请先设置总权重`,
        showType: 4,
      });
    }

    // Get all experiment weights for the course
    const experimentWeights = await this.experimentWeightRepository.findBy({
      courseId,
    });

    // Calculate sum of weights, excluding the current record if updating
    const currentSum = experimentWeights
      .filter((w) => w.id !== excludeId)
      .reduce((sum, w) => sum + Number(w.weight), 0);

    const newSum = currentSum + newWeight;

    if (newSum > Number(totalWeight.experimentWeight)) {
      throw new BadRequestException({
        errorCode: 'EXPERIMENT_WEIGHT_EXCEEDED',
        errorMessage: `实验权重总和（${newSum}）超过课程总实验权重（${totalWeight.experimentWeight}）`,
        showType: 4,
      });
    }
  }

  async create(createExperimentWeightDto: CreateExperimentWeightDto) {
    const { courseId, weight } = createExperimentWeightDto;

    // Validate weight sum
    await this.validateWeightSum(courseId, weight);

    const newRecord = this.experimentWeightRepository.create(
      createExperimentWeightDto,
    );
    return this.experimentWeightRepository.save(newRecord);
  }

  async findAll() {
    return this.experimentWeightRepository.find();
  }

  async findOne(id: number) {
    return this.experimentWeightRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateExperimentWeightDto: UpdateExperimentWeightDto,
  ) {
    const existing = await this.experimentWeightRepository.findOneBy({ id });
    if (!existing) {
      throw new BadRequestException({
        errorCode: 'EXPERIMENT_WEIGHT_NOT_FOUND',
        errorMessage: `实验权重 ID ${id} 不存在`,
        showType: 4,
      });
    }

    // Validate weight sum if weight is being updated
    if (updateExperimentWeightDto.weight !== undefined) {
      await this.validateWeightSum(
        existing.courseId,
        updateExperimentWeightDto.weight,
        id,
      );
    }

    await this.experimentWeightRepository.update(id, updateExperimentWeightDto);
    return this.experimentWeightRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.experimentWeightRepository.delete(id);
  }

  /**
   * 根据课程ID查询实验权重
   */
  async findByCourse(courseId: number) {
    return this.experimentWeightRepository.findBy({ courseId });
  }

  /**
   * 根据实验ID查询权重
   */
  async findByExperiment(experimentId: number) {
    return this.experimentWeightRepository.findBy({ experimentId });
  }

  /**
   * 通用查询（支持分页）
   */
  async findCommon(query: any): Promise<[ExperimentWeight[], number]> {
    const { page = 1, limit = 10, courseId, experimentId, ...filters } = query;

    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (experimentId) where.experimentId = experimentId;

    const [list, total] = await this.experimentWeightRepository.findAndCount({
      where: { ...where, ...filters },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return [list, total];
  }
}
