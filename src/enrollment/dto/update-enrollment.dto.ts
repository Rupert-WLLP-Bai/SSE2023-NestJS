import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEnrollmentDto } from './create-enrollment.dto';

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
  @ApiProperty({ description: '学生ID', example: 2052526 })
  studentId?: number;

  @ApiProperty({ description: '学生名称', example: '张三' })
  studentName?: string;

  @ApiProperty({ description: '班级ID', example: 1 })
  classId?: number;

  @ApiProperty({ description: '班级名称', example: '计算机21级1班' })
  className?: string;

  @ApiProperty({ description: '课程ID', example: 1 })
  courseId?: number;

  @ApiProperty({ description: '课程名称', example: '数据结构' })
  courseName?: string;

  @ApiProperty({ description: '状态', example: 'active' })
  status?: string;

  @ApiProperty({ description: '选课日期', example: '2023-01-01' })
  enrollmentDate?: Date;

  @ApiProperty({ description: '退课日期', example: '2023-01-01' })
  dropDate?: Date;

  @ApiProperty({ description: '成绩', example: 90 })
  grade?: number;

  @ApiProperty({ description: '备注', example: '优秀学生' })
  comment?: string;

  @ApiProperty({ description: '创建时间', example: '2023-01-01 00:00:00' })
  createTime?: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01 00:00:00' })
  updateTime?: Date;
}
