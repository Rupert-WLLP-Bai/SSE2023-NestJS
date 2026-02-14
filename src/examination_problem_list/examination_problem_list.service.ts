import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { CreateExaminationProblemListDto } from './dto/create-examination_problem_list.dto';
import { UpdateExaminationProblemListDto } from './dto/update-examination_problem_list.dto';
import { ExaminationProblemList } from './entities/examination_problem_list.entity';

@Injectable()
export class ExaminationProblemListService {
  constructor(
    @InjectRepository(ExaminationProblemList)
    private readonly problemListRepository: Repository<ExaminationProblemList>,
  ) {}
  private readonly logger = new Logger(ExaminationProblemListService.name);

  async create(
    createExaminationProblemListDto: CreateExaminationProblemListDto,
  ): Promise<ExaminationProblemList> {
    const problemList = this.problemListRepository.create(
      createExaminationProblemListDto,
    );
    return this.problemListRepository.save(problemList);
  }

  async findAll(): Promise<ExaminationProblemList[]> {
    return this.problemListRepository.find();
  }

  async findAndCount(): Promise<[ExaminationProblemList[], number]> {
    return this.problemListRepository.findAndCount();
  }

  async findOne(id: number): Promise<ExaminationProblemList | null> {
    return this.problemListRepository.findOneBy({ id });
  }

  async findByExaminationId(
    examinationId: number,
  ): Promise<ExaminationProblemList[]> {
    return this.problemListRepository.find({
      where: { examinationId },
      order: { problemOrder: 'ASC' },
    });
  }

  async update(
    id: number,
    updateExaminationProblemListDto: UpdateExaminationProblemListDto,
  ): Promise<UpdateResult> {
    return this.problemListRepository.update(
      id,
      updateExaminationProblemListDto,
    );
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.problemListRepository.delete(id);
  }

  async findPage(
    page: number,
    pageSize: number,
  ): Promise<[ExaminationProblemList[], number]> {
    const take = pageSize;
    const skip = (page - 1) * pageSize;
    return this.problemListRepository.findAndCount({
      take,
      skip,
    });
  }
}
