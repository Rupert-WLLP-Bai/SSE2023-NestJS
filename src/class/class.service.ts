import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { QueryClassDto } from './dto/query-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  private readonly logger = new Logger(ClassService.name);

  create(createClassDto: CreateClassDto) {
    return this.classRepository.save(createClassDto);
  }

  findAll() {
    return this.classRepository.find();
  }

  findOne(id: number) {
    return this.classRepository.findOneBy({ id: id });
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return this.classRepository.update(id, updateClassDto);
  }

  remove(id: number) {
    return this.classRepository.delete(id);
  }

  async findCommon(
    queryClassDto: QueryClassDto,
  ): Promise<[Class[], number]> {
    const { page, limit, sort, order, filter } = queryClassDto;
    const take = limit;
    const skip = (page - 1) * limit;
    const res = await this.classRepository.findAndCount({
      take: take,
      skip: skip,
      order: {
        [sort]: order,
      },
      where: {
        ...filter,
      },
    });
    const data = res[0];
    const total = res[1];
    return [data, total];
  }

  async findByCourseId(courseId: number): Promise<Class[]> {
    return this.classRepository.find({
      where: { courseId: courseId },
    });
  }

  async findByTeacherId(teacherId: number): Promise<Class[]> {
    return this.classRepository.find({
      where: { teacherId: teacherId },
    });
  }
}
