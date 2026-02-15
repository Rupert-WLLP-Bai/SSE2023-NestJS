import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExperimentScoreDto } from './dto/create-experiment_score.dto';
import { UpdateExperimentScoreDto } from './dto/update-experiment_score.dto';
import { ExperimentScore } from './entities/experiment_score.entity';

@Injectable()
export class ExperimentScoreService {
  constructor(
    @InjectRepository(ExperimentScore)
    private readonly experimentScoreRepository: Repository<ExperimentScore>,
  ) {}

  private readonly logger = new Logger(ExperimentScoreService.name);

  async create(createExperimentScoreDto: CreateExperimentScoreDto) {
    const newRecord = this.experimentScoreRepository.create(
      createExperimentScoreDto,
    );
    return this.experimentScoreRepository.save(newRecord);
  }

  async findAll() {
    return this.experimentScoreRepository.find();
  }

  async findOne(id: number) {
    return this.experimentScoreRepository.findOneBy({ id });
  }

  async findOneByCondition(where: any) {
    return this.experimentScoreRepository.findOne({ where });
  }

  async update(id: number, updateExperimentScoreDto: UpdateExperimentScoreDto) {
    await this.experimentScoreRepository.update(id, updateExperimentScoreDto);
    return this.experimentScoreRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.experimentScoreRepository.delete(id);
  }

  /**
   * 根据实验ID查询成绩
   */
  async findByExperiment(experimentId: number) {
    return this.experimentScoreRepository.findBy({ experimentId });
  }

  /**
   * 根据学生ID查询成绩
   */
  async findByStudent(studentId: number) {
    return this.experimentScoreRepository.findBy({ studentId });
  }

  /**
   * 通用查询（支持分页）
   */
  async findCommon(query: any): Promise<[ExperimentScore[], number]> {
    const { page = 1, limit = 10, experimentId, studentId, ...filters } = query;

    const where: any = {};
    if (experimentId) where.experimentId = experimentId;
    if (studentId) where.studentId = studentId;

    const [list, total] = await this.experimentScoreRepository.findAndCount({
      where: { ...where, ...filters },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return [list, total];
  }

  /**
   * Upsert experiment score (insert or update on conflict)
   * Upsert key: courseId + studentId + experimentId
   */
  async upsert(createExperimentScoreDto: CreateExperimentScoreDto) {
    const { courseId, studentId, experimentId, score } =
      createExperimentScoreDto;

    const existing = await this.experimentScoreRepository.findOne({
      where: { courseId, studentId, experimentId },
    });

    if (existing) {
      // Update existing record
      existing.score = score;
      return this.experimentScoreRepository.save(existing);
    }

    // Create new record
    const newRecord = this.experimentScoreRepository.create(
      createExperimentScoreDto,
    );
    return this.experimentScoreRepository.save(newRecord);
  }

  /**
   * 根据课程ID查询所有实验成绩
   */
  async findByCourse(courseId: number) {
    return this.experimentScoreRepository.findBy({ courseId });
  }

  /**
   * 根据课程ID和学生ID查询成绩
   */
  async findByCourseAndStudent(courseId: number, studentId: number) {
    return this.experimentScoreRepository.findBy({ courseId, studentId });
  }
}
