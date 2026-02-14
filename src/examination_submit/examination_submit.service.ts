import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExaminationSubmitDto } from './dto/create-examination_submit.dto';
import { UpdateExaminationSubmitDto } from './dto/update-examination_submit.dto';
import { ExaminationSubmit, SubmitStatus } from './entities/examination_submit.entity';
import { Examination, ExaminationStatus } from '../examination/entities/examination.entity';
import { ExaminationService } from '../examination/examination.service';

@Injectable()
export class ExaminationSubmitService {
  constructor(
    @InjectRepository(ExaminationSubmit)
    private readonly examinationSubmitRepository: Repository<ExaminationSubmit>,
    private readonly examinationService: ExaminationService,
  ) {}

  private readonly logger = new Logger(ExaminationSubmitService.name);

  async create(createExaminationSubmitDto: CreateExaminationSubmitDto) {
    const newRecord = this.examinationSubmitRepository.create(
      createExaminationSubmitDto,
    );
    return this.examinationSubmitRepository.save(newRecord);
  }

  async findAll() {
    return this.examinationSubmitRepository.find();
  }

  async findOne(id: number) {
    return this.examinationSubmitRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateExaminationSubmitDto: UpdateExaminationSubmitDto,
  ) {
    await this.examinationSubmitRepository.update(id, updateExaminationSubmitDto);
    return this.examinationSubmitRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.examinationSubmitRepository.delete(id);
  }

  /**
   * 根据考试ID查询提交
   */
  async findByExamination(examinationId: number) {
    return this.examinationSubmitRepository.findBy({ examinationId });
  }

  /**
   * 根据学生ID查询提交
   */
  async findByStudent(studentId: number) {
    return this.examinationSubmitRepository.findBy({ studentId });
  }

  /**
   * 根据题目ID查询提交
   */
  async findByProblem(problemId: number) {
    return this.examinationSubmitRepository.findBy({ problemId });
  }

  /**
   * 通用查询（支持分页）
   */
  async findCommon(query: any): Promise<[ExaminationSubmit[], number]> {
    const { page = 1, limit = 10, examinationId, studentId, problemId, status, ...filters } = query;

    const where: any = {};
    if (examinationId) where.examinationId = examinationId;
    if (studentId) where.studentId = studentId;
    if (problemId) where.problemId = problemId;
    if (status !== undefined) where.status = status;

    const [list, total] = await this.examinationSubmitRepository.findAndCount({
      where: { ...where, ...filters },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return [list, total];
  }

  /**
   * 验证提交窗口：仅在考试状态为 IN_PROGRESS 且当前时间在 startTime~endTime 区间内允许提交
   * @throws BadRequestException 如果不允许提交
   */
  async validateSubmissionWindow(examinationId: number): Promise<void> {
    const examination = await this.examinationService.findOne(examinationId);

    if (!examination) {
      throw new BadRequestException(`Examination with id ${examinationId} not found`);
    }

    // 检查考试状态
    if (examination.status !== ExaminationStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Submission not allowed: examination status is ${ExaminationStatus[examination.status]}, expected IN_PROGRESS`,
      );
    }

    // 检查时间窗口（使用 UTC 时间）
    const now = new Date();
    const startTime = new Date(examination.startTime);
    const endTime = new Date(examination.endTime);

    if (now < startTime) {
      throw new BadRequestException(
        `Submission not allowed: examination has not started yet (start time: ${startTime.toISOString()})`,
      );
    }

    if (now > endTime) {
      throw new BadRequestException(
        `Submission not allowed: examination has ended (end time: ${endTime.toISOString()})`,
      );
    }
  }

  /**
   * 创建提交并验证窗口
   */
  async createWithValidation(createDto: CreateExaminationSubmitDto): Promise<ExaminationSubmit> {
    await this.validateSubmissionWindow(createDto.examinationId);

    const newRecord = this.examinationSubmitRepository.create({
      ...createDto,
      status: SubmitStatus.SUBMITTED,
      submitTime: new Date(),
    });
    return this.examinationSubmitRepository.save(newRecord);
  }

  /**
   * 验证是否已提交（用于评分前检查）
   * @param problemId 可选，如果不提供则检查该学生是否有任何提交
   * @throws BadRequestException 如果未提交
   */
  async validateSubmitted(
    examinationId: number,
    studentId: number,
    problemId?: number,
  ): Promise<void> {
    const where: any = { examinationId, studentId };
    if (problemId !== undefined) {
      where.problemId = problemId;
    }

    const submit = await this.examinationSubmitRepository.findOne({ where });

    if (!submit) {
      throw new BadRequestException('Cannot grade: no submission found');
    }

    if (submit.status === SubmitStatus.NOT_SUBMITTED) {
      throw new BadRequestException('Cannot grade: submission not yet made');
    }
  }

  /**
   * 更新提交状态为已评分（评分成功后调用）
   * @param problemId 可选，如果不提供则更新该学生的所有提交
   */
  async markAsGraded(
    examinationId: number,
    studentId: number,
    problemId?: number,
  ): Promise<ExaminationSubmit | ExaminationSubmit[]> {
    const where: any = { examinationId, studentId };
    if (problemId !== undefined) {
      where.problemId = problemId;
    }

    if (problemId !== undefined) {
      const submit = await this.examinationSubmitRepository.findOne({ where });
      if (!submit) {
        throw new BadRequestException('Submission not found');
      }
      submit.status = SubmitStatus.GRADED;
      return this.examinationSubmitRepository.save(submit);
    } else {
      // 更新该学生的所有提交记录
      const submits = await this.examinationSubmitRepository.find({ where });
      if (submits.length === 0) {
        throw new BadRequestException('No submissions found');
      }
      for (const submit of submits) {
        submit.status = SubmitStatus.GRADED;
      }
      return this.examinationSubmitRepository.save(submits);
    }
  }
}
