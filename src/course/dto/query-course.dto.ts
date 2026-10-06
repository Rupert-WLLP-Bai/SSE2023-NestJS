import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Course } from '../entities/course.entity';

export class CourseFilter {
  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: '课程名称', example: '数据结构', nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '课程代码', example: 'CS301', nullable: true })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: '课程描述', example: '数据结构', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '教师ID', example: 2052526, nullable: true })
  @IsOptional()
  @IsNumber()
  teacherId?: number;

  @ApiProperty({ description: '教师名称', example: '张三', nullable: true })
  @IsOptional()
  @IsString()
  teacherName?: string;

  @ApiProperty({ description: '学分', example: 3, nullable: true })
  @IsOptional()
  @IsNumber()
  credit?: number;

  @ApiProperty({
    description: '创建时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  createTime?: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  updateTime?: Date;
}

export class QueryCourseDto {
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ description: '每页数量', example: 10, nullable: true })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({
    description: '排序字段',
    example: 'id',
    enum: [
      'id',
      'name',
      'code',
      'teacherId',
      'credit',
      'createTime',
      'updateTime',
    ],
    nullable: true,
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({
    description: '排序方式',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    nullable: true,
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @ApiProperty({
    type: Course,
    description: '过滤字段',
    example: { id: 1 },
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CourseFilter)
  filter?: CourseFilter;
}
