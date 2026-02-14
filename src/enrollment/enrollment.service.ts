import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { QueryEnrollmentDto } from './dto/query-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  private readonly logger = new Logger(EnrollmentService.name);

  create(createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentRepository.save(createEnrollmentDto);
  }

  findAll() {
    return this.enrollmentRepository.find();
  }

  findOne(id: number) {
    return this.enrollmentRepository.findOneBy({ id: id });
  }

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentRepository.update(id, updateEnrollmentDto);
  }

  remove(id: number) {
    return this.enrollmentRepository.delete(id);
  }

  async findCommon(
    queryEnrollmentDto: QueryEnrollmentDto,
  ): Promise<[Enrollment[], number]> {
    const { page, limit, sort, order, filter } = queryEnrollmentDto;
    const take = limit;
    const skip = (page - 1) * limit;
    const res = await this.enrollmentRepository.findAndCount({
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

  async findByStudentId(studentId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { studentId: studentId },
    });
  }

  async findByClassId(classId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { classId: classId },
    });
  }

  async findByCourseId(courseId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { courseId: courseId },
    });
  }

  async findByStudentAndClass(studentId: number, classId: number): Promise<Enrollment | null> {
    return this.enrollmentRepository.findOne({
      where: { studentId, classId },
    });
  }

  async dropCourse(studentId: number, classId: number): Promise<Enrollment | null> {
    const enrollment = await this.findByStudentAndClass(studentId, classId);
    if (enrollment) {
      enrollment.status = 'dropped';
      enrollment.dropDate = new Date();
      return this.enrollmentRepository.save(enrollment);
    }
    return null;
  }
}
