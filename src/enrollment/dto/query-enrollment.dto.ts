import { ApiProperty } from '@nestjs/swagger';
import { Enrollment } from '../entities/enrollment.entity';

export class EnrollmentFilter {
  @ApiProperty({ description: '选课ID', example: 1, nullable: true })
  id?: number;

  @ApiProperty({ description: '学生ID', example: 2052526, nullable: true })
  studentId?: number;

  @ApiProperty({ description: '学生名称', example: '张三', nullable: true })
  studentName?: string;

  @ApiProperty({ description: '班级ID', example: 1, nullable: true })
  classId?: number;

  @ApiProperty({ description: '班级名称', example: '计算机21级1班', nullable: true })
  className?: string;

  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  courseId?: number;

  @ApiProperty({ description: '课程名称', example: '数据结构', nullable: true })
  courseName?: string;

  @ApiProperty({ description: '状态', example: 'active', nullable: true })
  status?: string;

  @ApiProperty({ description: '选课日期', example: '2023-01-01', nullable: true })
  enrollmentDate?: Date;

  @ApiProperty({ description: '退课日期', example: '2023-01-01', nullable: true })
  dropDate?: Date;

  @ApiProperty({ description: '成绩', example: 90, nullable: true })
  grade?: number;

  @ApiProperty({ description: '备注', example: '优秀学生', nullable: true })
  comment?: string;

  @ApiProperty({
    description: '创建时间',
    example: '2023-01-01 00:00:00',
    nullable: true,
  })
  createTime?: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2023-01-01 00:00:00',
    nullable: true,
  })
  updateTime?: Date;
}

export class QueryEnrollmentDto {
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  page?: number;

  @ApiProperty({ description: '每页数量', example: 10, nullable: true })
  limit?: number;

  @ApiProperty({
    description: '排序字段',
    example: 'id',
    enum: ['id', 'studentId', 'classId', 'courseId', 'grade', 'enrollmentDate', 'createTime', 'updateTime'],
    nullable: true,
  })
  sort?: string;

  @ApiProperty({
    description: '排序方式',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    nullable: true,
  })
  order?: 'ASC' | 'DESC';

  @ApiProperty({
    type: Enrollment,
    description: '过滤字段',
    example: { id: 1 },
    nullable: true,
  })
  filter?: EnrollmentFilter;
}
