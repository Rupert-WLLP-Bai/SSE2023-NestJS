import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, DataSource } from 'typeorm';
import { CreateExaminationStudentListDto } from './dto/create-examination_student_list.dto';
import { UpdateExaminationStudentListDto } from './dto/update-examination_student_list.dto';
import { ExaminationStudentList } from './entities/examination_student_list.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { User } from '../user/entities/user.entity';

export interface ImportResult {
  added: number;
  skipped: number;
  total: number;
}

@Injectable()
export class ExaminationStudentListService {
  constructor(
    @InjectRepository(ExaminationStudentList)
    private readonly studentListRepository: Repository<ExaminationStudentList>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(ExaminationStudentListService.name);

  async create(
    createExaminationStudentListDto: CreateExaminationStudentListDto,
  ): Promise<ExaminationStudentList> {
    const studentList = this.studentListRepository.create(
      createExaminationStudentListDto,
    );
    return this.studentListRepository.save(studentList);
  }

  async findAll(): Promise<ExaminationStudentList[]> {
    return this.studentListRepository.find();
  }

  async findAndCount(): Promise<[ExaminationStudentList[], number]> {
    return this.studentListRepository.findAndCount();
  }

  async findOne(id: number): Promise<ExaminationStudentList | null> {
    return this.studentListRepository.findOneBy({ id });
  }

  async findByExaminationId(
    examinationId: number,
  ): Promise<ExaminationStudentList[]> {
    return this.studentListRepository.find({
      where: { examinationId },
    });
  }

  async findByStudentId(studentId: number): Promise<ExaminationStudentList[]> {
    return this.studentListRepository.find({
      where: { studentId },
    });
  }

  async update(
    id: number,
    updateExaminationStudentListDto: UpdateExaminationStudentListDto,
  ): Promise<UpdateResult> {
    return this.studentListRepository.update(
      id,
      updateExaminationStudentListDto,
    );
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.studentListRepository.delete(id);
  }

  async findPage(
    page: number,
    pageSize: number,
  ): Promise<[ExaminationStudentList[], number]> {
    const take = pageSize;
    const skip = (page - 1) * pageSize;
    return this.studentListRepository.findAndCount({
      take,
      skip,
    });
  }

  /**
   * 按班级导入考生
   * 使用事务处理批量导入，对 (examinationId, studentId) 去重
   * @returns 导入结果（新增数量、跳过数量）
   */
  async importStudentsFromClass(
    examinationId: number,
    classId: number,
  ): Promise<ImportResult> {
    // 获取班级的所有学生
    const enrollments = await this.enrollmentRepository.find({
      where: { classId },
    });

    if (enrollments.length === 0) {
      throw new BadRequestException(`No students found in class ${classId}`);
    }

    // 获取用户信息
    const studentIds = enrollments.map((e) => e.studentId);
    const users = await this.userRepository.findByIds(studentIds);
    const userMap = new Map(users.map((u) => [u.id, u]));

    // 查询已存在的考生列表
    const existingRecords = await this.studentListRepository.find({
      where: {
        examinationId,
        studentId: undefined,
      },
    });
    // 过滤出已存在的 (examinationId, studentId) 组合
    const existingSet = new Set(
      existingRecords.map((r) => `${r.examinationId}-${r.studentId}`),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let added = 0;
    let skipped = 0;

    try {
      for (const enrollment of enrollments) {
        const key = `${examinationId}-${enrollment.studentId}`;

        // 检查是否已存在
        if (existingSet.has(key)) {
          skipped++;
          continue;
        }

        // 再次检查数据库确保没有重复
        const existing = await this.studentListRepository.findOne({
          where: {
            examinationId,
            studentId: enrollment.studentId,
          },
        });

        if (existing) {
          skipped++;
          continue;
        }

        // 创建新记录
        const user = userMap.get(enrollment.studentId);
        const studentList = this.studentListRepository.create({
          examinationId,
          studentId: enrollment.studentId,
          studentName: enrollment.studentName || user?.name || 'Unknown',
          studentNumber: user?.id?.toString() || '',
          status: 0, // NOT_STARTED
          createTime: new Date(),
          updateTime: new Date(),
        });

        await queryRunner.manager.save(studentList);
        added++;
        existingSet.add(key);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return {
      added,
      skipped,
      total: enrollments.length,
    };
  }
}
