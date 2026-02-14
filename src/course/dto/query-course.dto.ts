import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../entities/course.entity';

export class CourseFilter {
  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  id?: number;

  @ApiProperty({ description: '课程名称', example: '数据结构', nullable: true })
  name?: string;

  @ApiProperty({ description: '课程代码', example: 'CS301', nullable: true })
  code?: string;

  @ApiProperty({ description: '课程描述', example: '数据结构', nullable: true })
  description?: string;

  @ApiProperty({ description: '教师ID', example: 2052526, nullable: true })
  teacherId?: number;

  @ApiProperty({ description: '教师名称', example: '张三', nullable: true })
  teacherName?: string;

  @ApiProperty({ description: '学分', example: 3, nullable: true })
  credit?: number;

  @ApiProperty({
    description: '创建时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  createTime?: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  updateTime?: Date;
}

export class QueryCourseDto {
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  page?: number;

  @ApiProperty({ description: '每页数量', example: 10, nullable: true })
  limit?: number;

  @ApiProperty({
    description: '排序字段',
    example: 'id',
    enum: ['id', 'name', 'code', 'teacherId', 'credit', 'createTime', 'updateTime'],
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
    type: Course,
    description: '过滤字段',
    example: { id: 1 },
    nullable: true,
  })
  filter?: CourseFilter;
}
