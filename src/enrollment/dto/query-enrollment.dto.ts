import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Enrollment } from '../entities/enrollment.entity';

export class EnrollmentFilter {
  @ApiProperty({ description: '选课ID', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: '学生ID', example: 2052526, nullable: true })
  @IsOptional()
  @IsNumber()
  studentId?: number;

  @ApiProperty({ description: '学生名称', example: '张三', nullable: true })
  @IsOptional()
  @IsString()
  studentName?: string;

  @ApiProperty({ description: '班级ID', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  classId?: number;

  @ApiProperty({
    description: '班级名称',
    example: '计算机21级1班',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  className?: string;

  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  courseId?: number;

  @ApiProperty({ description: '课程名称', example: '数据结构', nullable: true })
  @IsOptional()
  @IsString()
  courseName?: string;

  @ApiProperty({ description: '状态', example: 'active', nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: '选课日期',
    example: '2023-01-01',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  enrollmentDate?: Date;

  @ApiProperty({
    description: '退课日期',
    example: '2023-01-01',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  dropDate?: Date;

  @ApiProperty({ description: '成绩', example: 90, nullable: true })
  @IsOptional()
  @IsNumber()
  grade?: number;

  @ApiProperty({ description: '备注', example: '优秀学生', nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: '创建时间',
    example: '2023-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  createTime?: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2023-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  updateTime?: Date;
}

export class QueryEnrollmentDto {
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
      'studentId',
      'classId',
      'courseId',
      'grade',
      'enrollmentDate',
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
    type: Enrollment,
    description: '过滤字段',
    example: { id: 1 },
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EnrollmentFilter)
  filter?: EnrollmentFilter;
}
