import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { CreateExaminationStudentListDto } from './dto/create-examination_student_list.dto';
import { UpdateExaminationStudentListDto } from './dto/update-examination_student_list.dto';
import { ExaminationStudentList } from './entities/examination_student_list.entity';

@Injectable()
export class ExaminationStudentListService {
  constructor(
    @InjectRepository(ExaminationStudentList)
    private readonly studentListRepository: Repository<ExaminationStudentList>,
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
}
