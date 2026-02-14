import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @ApiProperty({ description: '课程名称', example: '数据结构' })
  name?: string;

  @ApiProperty({ description: '课程代码', example: 'CS301' })
  code?: string;

  @ApiProperty({ description: '课程描述', example: '学习数据结构的基本概念和算法' })
  description?: string;

  @ApiProperty({ description: '教师ID', example: 2052526 })
  teacherId?: number;

  @ApiProperty({ description: '教师名称', example: '张三' })
  teacherName?: string;

  @ApiProperty({ description: '学分', example: 3 })
  credit?: number;

  @ApiProperty({ description: '创建时间', example: '2021-01-01 00:00:00' })
  createTime?: Date;

  @ApiProperty({ description: '更新时间', example: '2021-01-01 00:00:00' })
  updateTime?: Date;
}
