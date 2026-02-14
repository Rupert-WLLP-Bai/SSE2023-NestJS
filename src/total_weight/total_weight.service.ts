import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTotalWeightDto } from './dto/create-total_weight.dto';
import { UpdateTotalWeightDto } from './dto/update-total_weight.dto';
import { TotalWeight } from './entities/total_weight.entity';

@Injectable()
export class TotalWeightService {
  constructor(
    @InjectRepository(TotalWeight)
    private readonly totalWeightRepository: Repository<TotalWeight>,
  ) {}

  private readonly logger = new Logger(TotalWeightService.name);

  /**
   * Validates that experimentWeight + examinationWeight = 100
   */
  private validateWeightSum(
    experimentWeight: number,
    examinationWeight: number,
  ): void {
    const sum = Number(experimentWeight) + Number(examinationWeight);
    if (sum !== 100) {
      throw new BadRequestException({
        errorCode: 'INVALID_WEIGHT_SUM',
        errorMessage: `权重总和必须为100，当前为${sum}（实验权重: ${experimentWeight} + 考试权重: ${examinationWeight}）`,
        showType: 4,
      });
    }
  }

  /**
   * Create or update total weight for a course (upsert behavior)
   * If a record exists for the course, update it; otherwise create new
   */
  async create(createTotalWeightDto: CreateTotalWeightDto) {
    const { courseId, experimentWeight, examinationWeight } =
      createTotalWeightDto;

    // Validate weight sum = 100
    this.validateWeightSum(experimentWeight, examinationWeight);

    // Check if record already exists for this course
    const existing = await this.totalWeightRepository.findOneBy({ courseId });

    if (existing) {
      // Update existing record
      Object.assign(existing, {
        experimentWeight,
        examinationWeight,
      });
      return this.totalWeightRepository.save(existing);
    }

    // Create new record
    const newRecord = this.totalWeightRepository.create(createTotalWeightDto);
    return this.totalWeightRepository.save(newRecord);
  }

  findAll() {
    return this.totalWeightRepository.find();
  }

  findOne(id: number) {
    return this.totalWeightRepository.findOneBy({ id });
  }

  /**
   * Find total weight by course ID
   */
  findByCourse(courseId: number) {
    return this.totalWeightRepository.findOneBy({ courseId });
  }

  async update(id: number, updateTotalWeightDto: UpdateTotalWeightDto) {
    const { experimentWeight, examinationWeight } = updateTotalWeightDto;

    // Validate weight sum if both weights are provided
    if (
      experimentWeight !== undefined &&
      examinationWeight !== undefined
    ) {
      this.validateWeightSum(experimentWeight, examinationWeight);
    } else if (experimentWeight !== undefined) {
      // If only experimentWeight is provided, get existing examinationWeight
      const existing = await this.totalWeightRepository.findOneBy({ id });
      if (existing) {
        this.validateWeightSum(experimentWeight, Number(existing.examinationWeight));
      }
    } else if (examinationWeight !== undefined) {
      // If only examinationWeight is provided, get existing experimentWeight
      const existing = await this.totalWeightRepository.findOneBy({ id });
      if (existing) {
        this.validateWeightSum(Number(existing.experimentWeight), examinationWeight);
      }
    }

    await this.totalWeightRepository.update(id, updateTotalWeightDto);
    return this.totalWeightRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.totalWeightRepository.delete(id);
  }
}
