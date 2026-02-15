import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../entities/class.entity';

export class ClassFilter {
  @ApiProperty({ description: '班级ID', example: 1, nullable: true })
  id?: number;

  @ApiProperty({
    description: '班级名称',
    example: '计算机21级1班',
    nullable: true,
  })
  name?: string;

  @ApiProperty({ description: '班级代码', example: 'CS2021-1', nullable: true })
  code?: string;

  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  courseId?: number;

  @ApiProperty({ description: '教师ID', example: 2052526, nullable: true })
  teacherId?: number;

  @ApiProperty({ description: '教师名称', example: '张三', nullable: true })
  teacherName?: string;

  @ApiProperty({ description: '学期', example: '春季', nullable: true })
  semester?: string;

  @ApiProperty({ description: '年份', example: 2023, nullable: true })
  year?: number;

  @ApiProperty({ description: '最大学生数', example: 60, nullable: true })
  maxStudents?: number;

  @ApiProperty({ description: '当前学生数', example: 30, nullable: true })
  currentStudents?: number;

  @ApiProperty({
    description: '描述',
    example: '计算机科学与技术专业班级',
    nullable: true,
  })
  description?: string;

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

export class QueryClassDto {
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  page?: number;

  @ApiProperty({ description: '每页数量', example: 10, nullable: true })
  limit?: number;

  @ApiProperty({
    description: '排序字段',
    example: 'id',
    enum: [
      'id',
      'name',
      'code',
      'courseId',
      'teacherId',
      'year',
      'createTime',
      'updateTime',
    ],
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
    type: Class,
    description: '过滤字段',
    example: { id: 1 },
    nullable: true,
  })
  filter?: ClassFilter;
}
