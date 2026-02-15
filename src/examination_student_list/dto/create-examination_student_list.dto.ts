import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { StudentStatus } from '../entities/examination_student_list.entity';

export class CreateExaminationStudentListDto {
  @ApiProperty({ description: '考试ID', example: 1 })
  @IsNumber()
  examinationId: number;

  @ApiProperty({ description: '学生ID', example: 1001 })
  @IsNumber()
  studentId: number;

  @ApiProperty({ description: '学生姓名', example: '张三', required: false })
  @IsOptional()
  @IsString()
  studentName?: string;

  @ApiProperty({ description: '学号', example: '2052526', required: false })
  @IsOptional()
  @IsString()
  studentNumber?: string;

  @ApiProperty({
    description: '学生状态',
    example: 0,
    enum: StudentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;

  @ApiProperty({ description: '分数', example: 85, required: false })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiProperty({
    description: '开始时间',
    example: '2023-06-01 09:00:00',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @ApiProperty({
    description: '结束时间',
    example: '2023-06-01 12:00:00',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @ApiProperty({
    description: '创建时间',
    example: '2023-05-15 00:00:00',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createTime?: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2023-05-15 00:00:00',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  updateTime?: Date;
}
