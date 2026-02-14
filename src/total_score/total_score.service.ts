import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateTotalScoreDto } from './dto/create-total_score.dto';
import { UpdateTotalScoreDto } from './dto/update-total_score.dto';
import { TotalScore } from './entities/total_score.entity';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { ExperimentScore } from '../experiment_score/entities/experiment_score.entity';
import { ExperimentWeight } from '../experiment_weight/entities/experiment_weight.entity';
import { ExaminationScore } from '../examination_score/entities/examination_score.entity';
import { ExaminationWeight } from '../examination_weight/entities/examination_weight.entity';
import { EnrollmentService } from '../enrollment/enrollment.service';

@Injectable()
export class TotalScoreService {
  constructor(
    @InjectRepository(TotalScore)
    private readonly totalScoreRepository: Repository<TotalScore>,
    @InjectRepository(TotalWeight)
    private readonly totalWeightRepository: Repository<TotalWeight>,
    @InjectRepository(ExperimentScore)
    private readonly experimentScoreRepository: Repository<ExperimentScore>,
    @InjectRepository(ExperimentWeight)
    private readonly experimentWeightRepository: Repository<ExperimentWeight>,
    @InjectRepository(ExaminationScore)
    private readonly examinationScoreRepository: Repository<ExaminationScore>,
    @InjectRepository(ExaminationWeight)
    private readonly examinationWeightRepository: Repository<ExaminationWeight>,
    private readonly enrollmentService: EnrollmentService,
    private readonly dataSource: DataSource,
  ) {}

  private readonly logger = new Logger(TotalScoreService.name);

  async create(createTotalScoreDto: CreateTotalScoreDto) {
    const newRecord = this.totalScoreRepository.create(createTotalScoreDto);
    return this.totalScoreRepository.save(newRecord);
  }

  async findAll() {
    return this.totalScoreRepository.find();
  }

  async findOne(id: number) {
    return this.totalScoreRepository.findOneBy({ id });
  }

  async update(id: number, updateTotalScoreDto: UpdateTotalScoreDto) {
    await this.totalScoreRepository.update(id, updateTotalScoreDto);
    return this.totalScoreRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.totalScoreRepository.delete(id);
  }

  /**
   * 根据课程ID查询总成绩
   */
  async findByCourse(courseId: number) {
    return this.totalScoreRepository.findBy({ courseId });
  }

  /**
   * 根据学生ID查询总成绩
   */
  async findByStudent(studentId: number) {
    return this.totalScoreRepository.findBy({ studentId });
  }

  /**
   * 通用查询（支持分页）
   */
  async findCommon(query: any): Promise<[TotalScore[], number]> {
    const { page = 1, limit = 10, courseId, studentId, ...filters } = query;

    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (studentId) where.studentId = studentId;

    const [list, total] = await this.totalScoreRepository.findAndCount({
      where: { ...where, ...filters },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return [list, total];
  }

  /**
   * 计算单个学生的总分
   * 计算公式：
   * - experimentTotalScore = Σ(实验得分 × 实验权重占比)
   * - examinationTotalScore = Σ(考试得分 × 考试权重占比)
   * - totalScore = experimentTotalScore + examinationTotalScore
   */
  private async calculateStudentTotalScore(
    courseId: number,
    studentId: number,
    totalExperimentWeight: number,
    totalExaminationWeight: number,
  ): Promise<{
    experimentScore: number;
    examinationScore: number;
    totalScore: number;
  }> {
    // 获取该课程所有实验权重
    const experimentWeights = await this.experimentWeightRepository.find({
      where: { courseId },
    });

    // 获取该课程所有考试权重
    const examinationWeights = await this.examinationWeightRepository.find({
      where: { courseId },
    });

    // 计算实验总分
    let experimentTotalScore = 0;
    for (const expWeight of experimentWeights) {
      const expScore = await this.experimentScoreRepository.findOne({
        where: { courseId, studentId, experimentId: expWeight.experimentId },
      });
      if (expScore) {
        // 权重占比 = 单项权重 / 总实验权重
        const weightRatio = Number(expWeight.weight) / Number(totalExperimentWeight);
        experimentTotalScore += Number(expScore.score) * weightRatio;
      }
    }

    // 计算考试总分
    let examinationTotalScore = 0;
    for (const examWeight of examinationWeights) {
      const examScores = await this.examinationScoreRepository.find({
        where: { courseId, studentId, examinationId: examWeight.examinationId },
      });
      // 考试可能是多题目的，需要计算加权平均
      if (examScores.length > 0) {
        const totalExamScore = examScores.reduce(
          (sum, s) => sum + Number(s.score),
          0,
        );
        const avgExamScore = totalExamScore / examScores.length;
        // 权重占比 = 单项权重 / 总考试权重
        const weightRatio = Number(examWeight.weight) / Number(totalExaminationWeight);
        examinationTotalScore += avgExamScore * weightRatio;
      }
    }

    // 计算最终总分
    const totalScore = experimentTotalScore + examinationTotalScore;

    // 保留两位小数
    return {
      experimentScore: Math.round(experimentTotalScore * 100) / 100,
      examinationScore: Math.round(examinationTotalScore * 100) / 100,
      totalScore: Math.round(totalScore * 100) / 100,
    };
  }

  /**
   * 重新计算课程全体学生的总分（使用事务保证原子性）
   */
  async recalculate(courseId: number): Promise<TotalScore[]> {
    // 获取课程总权重
    const totalWeight = await this.totalWeightRepository.findOneBy({ courseId });
    if (!totalWeight) {
      throw new BadRequestException({
        errorCode: 'TOTAL_WEIGHT_NOT_FOUND',
        errorMessage: `课程 ${courseId} 的总权重未设置`,
        showType: 4,
      });
    }

    // 获取课程所有学生
    const enrollments = await this.enrollmentService.findByCourseId(courseId);
    if (enrollments.length === 0) {
      throw new BadRequestException({
        errorCode: 'NO_STUDENTS',
        errorMessage: `课程 ${courseId} 没有选课学生`,
        showType: 4,
      });
    }

    // 使用事务保证原子性
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 删除该课程现有的所有总分记录
      await queryRunner.manager.delete(TotalScore, { courseId });

      const results: TotalScore[] = [];
      const totalExperimentWeight = Number(totalWeight.experimentWeight);
      const totalExaminationWeight = Number(totalWeight.examinationWeight);

      // 为每个学生计算并保存总分
      for (const enrollment of enrollments) {
        const studentId = enrollment.studentId;

        const scores = await this.calculateStudentTotalScore(
          courseId,
          studentId,
          totalExperimentWeight,
          totalExaminationWeight,
        );

        const totalScore = queryRunner.manager.create(TotalScore, {
          courseId,
          studentId,
          totalScore: scores.totalScore,
          experimentScore: scores.experimentScore,
          examinationScore: scores.examinationScore,
        });

        const saved = await queryRunner.manager.save(totalScore);
        results.push(saved);
      }

      await queryRunner.commitTransaction();
      return results;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 查询课程全体学生总分（包含学生信息）
   */
  async findByCourseWithStudents(courseId: number) {
    const totalScores = await this.totalScoreRepository.find({
      where: { courseId },
      order: { totalScore: 'DESC' },
    });
    return totalScores;
  }
}
