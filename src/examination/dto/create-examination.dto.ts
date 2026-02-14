import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDateString, IsEnum } from 'class-validator';
import { ExaminationStatus, ExaminationType } from '../entities/examination.entity';

export class CreateExaminationDto {
  @ApiProperty({ description: '考试标题', example: '期末考试' })
  title: string;

  @ApiProperty({ description: '考试描述', example: '2023年春季学期期末考试', required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '课程ID', example: 1 })
  courseId: number;

  @ApiProperty({ description: '课程名称', example: '软件工程', required: false })
  @IsOptional()
  courseName?: string;

  @ApiProperty({ description: '发布者ID', example: 2052526 })
  publisherId: number;

  @ApiProperty({ description: '发布者名称', example: '教师姓名', required: false })
  @IsOptional()
  publisherName?: string;

  @ApiProperty({ description: '考试开始时间', example: '2023-06-01 09:00:00' })
  startTime: Date;

  @ApiProperty({ description: '考试结束时间', example: '2023-06-01 12:00:00' })
  endTime: Date;

  @ApiProperty({ description: '考试时长（分钟）', example: 180 })
  duration: number;

  @ApiProperty({ description: '总分', example: 100 })
  totalScore: number;

  @ApiProperty({ description: '及格分数', example: 60, required: false })
  @IsOptional()
  passingScore?: number;

  @ApiProperty({
    description: '考试状态',
    example: 0,
    enum: ExaminationStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExaminationStatus)
  status?: ExaminationStatus;

  @ApiProperty({
    description: '考试类型',
    example: 'online',
    enum: ExaminationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExaminationType)
  type?: ExaminationType;

  @ApiProperty({ description: '创建时间', example: '2023-05-15 00:00:00', required: false })
  @IsOptional()
  createTime?: Date;

  @ApiProperty({ description: '更新时间', example: '2023-05-15 00:00:00', required: false })
  @IsOptional()
  updateTime?: Date;
}
