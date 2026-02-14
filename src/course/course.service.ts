import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  private readonly logger = new Logger(CourseService.name);

  create(createCourseDto: CreateCourseDto) {
    return this.courseRepository.save(createCourseDto);
  }

  findAll() {
    return this.courseRepository.find();
  }

  findOne(id: number) {
    return this.courseRepository.findOneBy({ id: id });
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.courseRepository.update(id, updateCourseDto);
  }

  remove(id: number) {
    return this.courseRepository.delete(id);
  }

  async findCommon(
    queryCourseDto: QueryCourseDto,
  ): Promise<[Course[], number]> {
    const { page, limit, sort, order, filter } = queryCourseDto;
    const take = limit;
    const skip = (page - 1) * limit;
    const res = await this.courseRepository.findAndCount({
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
    // this.logger.debug('total = ' + total);
    return [data, total];
  }
}
