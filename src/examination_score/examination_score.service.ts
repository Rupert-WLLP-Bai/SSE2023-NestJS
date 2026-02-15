import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExaminationScoreDto } from './dto/create-examination_score.dto';
import { UpdateExaminationScoreDto } from './dto/update-examination_score.dto';
import { ExaminationScore } from './entities/examination_score.entity';
import { ExaminationSubmitService } from '../examination_submit/examination_submit.service';

@Injectable()
export class ExaminationScoreService {
  constructor(
    @InjectRepository(ExaminationScore)
    private readonly examinationScoreRepository: Repository<ExaminationScore>,
    private readonly examinationSubmitService: ExaminationSubmitService,
  ) {}

  private readonly logger = new Logger(ExaminationScoreService.name);

  async create(createExaminationScoreDto: CreateExaminationScoreDto) {
    const { examinationId, studentId } = createExaminationScoreDto;

    // 评分前检查提交记录是否存在且状态为 SUBMITTED
    await this.examinationSubmitService.validateSubmitted(
      examinationId,
      studentId,
    );

    const newRecord = this.examinationScoreRepository.create(
      createExaminationScoreDto,
    );
    const savedRecord = await this.examinationScoreRepository.save(newRecord);

    return savedRecord;
  }

  async findAll() {
    return this.examinationScoreRepository.find();
  }

  async findOne(id: number) {
    return this.examinationScoreRepository.findOneBy({ id });
  }

  async findOneByCondition(where: any) {
    return this.examinationScoreRepository.findOne({ where });
  }

  async update(
    id: number,
    updateExaminationScoreDto: UpdateExaminationScoreDto,
  ) {
    const existingScore = await this.examinationScoreRepository.findOneBy({
      id,
    });
    if (!existingScore) {
      throw new BadRequestException(
        `Examination score with id ${id} not found`,
      );
    }

    const { examinationId, studentId } = existingScore;

    // 评分前检查提交记录是否存在且状态为 SUBMITTED
    await this.examinationSubmitService.validateSubmitted(
      examinationId,
      studentId,
    );

    await this.examinationScoreRepository.update(id, updateExaminationScoreDto);
    const updatedRecord = await this.examinationScoreRepository.findOneBy({
      id,
    });

    return updatedRecord;
  }

  async remove(id: number) {
    return this.examinationScoreRepository.delete(id);
  }

  /**
   * 根据考试ID查询成绩
   */
  async findByExamination(examinationId: number) {
    return this.examinationScoreRepository.findBy({ examinationId });
  }

  /**
   * 根据学生ID查询成绩
   */
  async findByStudent(studentId: number) {
    return this.examinationScoreRepository.findBy({ studentId });
  }

  /**
   * 通用查询（支持分页）
   */
  async findCommon(query: any): Promise<[ExaminationScore[], number]> {
    const {
      page = 1,
      limit = 10,
      examinationId,
      studentId,
      ...filters
    } = query;

    const where: any = {};
    if (examinationId) where.examinationId = examinationId;
    if (studentId) where.studentId = studentId;

    const [list, total] = await this.examinationScoreRepository.findAndCount({
      where: { ...where, ...filters },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return [list, total];
  }

  /**
   * Upsert examination score (insert or update on conflict)
   * Upsert key: courseId + studentId + examinationId + problemId
   */
  async upsert(createExaminationScoreDto: CreateExaminationScoreDto) {
    const { courseId, studentId, examinationId, problemId, score } =
      createExaminationScoreDto;

    // 评分前检查提交记录是否存在且状态为 SUBMITTED
    await this.examinationSubmitService.validateSubmitted(
      examinationId,
      studentId,
    );

    const existing = await this.examinationScoreRepository.findOne({
      where: { courseId, studentId, examinationId, problemId },
    });

    let savedRecord: ExaminationScore;

    if (existing) {
      // Update existing record
      existing.score = score;
      savedRecord = await this.examinationScoreRepository.save(existing);
    } else {
      // Create new record
      const newRecord = this.examinationScoreRepository.create(
        createExaminationScoreDto,
      );
      savedRecord = await this.examinationScoreRepository.save(newRecord);
    }

    return savedRecord;
  }

  /**
   * 根据课程ID查询所有考试成绩
   */
  async findByCourse(courseId: number) {
    return this.examinationScoreRepository.findBy({ courseId });
  }

  /**
   * 根据课程ID和学生ID查询成绩
   */
  async findByCourseAndStudent(courseId: number, studentId: number) {
    return this.examinationScoreRepository.findBy({ courseId, studentId });
  }
}
