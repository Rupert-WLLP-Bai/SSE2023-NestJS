import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ description: '学生ID', example: 2052526 })
  @IsNotEmpty({ message: '学生ID不能为空' })
  @IsInt()
  @Min(1)
  studentId: number;

  @ApiProperty({ description: '学生名称', example: '张三', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  studentName?: string;

  @ApiProperty({ description: '班级ID', example: 1 })
  @IsNotEmpty({ message: '班级ID不能为空' })
  @IsInt()
  @Min(1)
  classId: number;

  @ApiProperty({
    description: '班级名称',
    example: '计算机21级1班',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  className?: string;

  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  courseId?: number;

  @ApiProperty({ description: '课程名称', example: '数据结构', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  courseName?: string;

  @ApiProperty({ description: '状态', example: 'active', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;

  @ApiProperty({
    description: '选课日期',
    example: '2023-01-01',
    nullable: true,
  })
  @IsOptional()
  @IsDateString({}, { message: '选课日期格式不正确' })
  enrollmentDate?: Date;

  @ApiProperty({
    description: '退课日期',
    example: '2023-01-01',
    nullable: true,
  })
  @IsOptional()
  @IsDateString({}, { message: '退课日期格式不正确' })
  dropDate?: Date;

  @ApiProperty({ description: '成绩', example: 90, nullable: true })
  @IsOptional()
  @IsNumber({}, { message: '成绩必须是数字' })
  @Min(0)
  @Max(100)
  grade?: number;

  @ApiProperty({ description: '备注', example: '优秀学生', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;

  @ApiProperty({ description: '创建时间', example: '2023-01-01 00:00:00' })
  @IsOptional()
  @IsDateString({}, { message: '创建时间格式不正确' })
  createTime?: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01 00:00:00' })
  @IsOptional()
  @IsDateString({}, { message: '更新时间格式不正确' })
  updateTime?: Date;
}
