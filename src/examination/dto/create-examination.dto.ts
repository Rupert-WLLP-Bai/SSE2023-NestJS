import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import {
  ExaminationStatus,
  ExaminationType,
} from '../entities/examination.entity';

export class CreateExaminationDto {
  @ApiProperty({ description: '考试标题', example: '期末考试' })
  @IsNotEmpty({ message: '考试标题不能为空' })
  @IsString()
  @Min(1)
  @Max(100)
  title: string;

  @ApiProperty({
    description: '考试描述',
    example: '2023年春季学期期末考试',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Max(500)
  description?: string;

  @ApiProperty({ description: '课程ID', example: 1 })
  @IsNotEmpty({ message: '课程ID不能为空' })
  @IsNumber({}, { message: '课程ID必须是数字' })
  @Min(1)
  courseId: number;

  @ApiProperty({
    description: '课程名称',
    example: '软件工程',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Max(100)
  courseName?: string;

  @ApiProperty({ description: '发布者ID', example: 2052526 })
  @IsNotEmpty({ message: '发布者ID不能为空' })
  @IsNumber({}, { message: '发布者ID必须是数字' })
  @Min(1)
  publisherId: number;

  @ApiProperty({
    description: '发布者名称',
    example: '教师姓名',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Max(50)
  publisherName?: string;

  @ApiProperty({ description: '考试开始时间', example: '2023-06-01 09:00:00' })
  @IsNotEmpty({ message: '开始时间不能为空' })
  @IsDateString({}, { message: '开始时间格式不正确' })
  startTime: Date;

  @ApiProperty({ description: '考试结束时间', example: '2023-06-01 12:00:00' })
  @IsNotEmpty({ message: '结束时间不能为空' })
  @IsDateString({}, { message: '结束时间格式不正确' })
  endTime: Date;

  @ApiProperty({ description: '考试时长（分钟）', example: 180 })
  @IsNotEmpty({ message: '考试时长不能为空' })
  @IsNumber({}, { message: '考试时长必须是数字' })
  @Min(1)
  @Max(600)
  duration: number;

  @ApiProperty({ description: '总分', example: 100 })
  @IsNotEmpty({ message: '总分不能为空' })
  @IsNumber({}, { message: '总分必须是数字' })
  @Min(1)
  @Max(1000)
  totalScore: number;

  @ApiProperty({ description: '及格分数', example: 60, required: false })
  @IsOptional()
  @IsNumber({}, { message: '及格分数必须是数字' })
  @Min(0)
  @Max(1000)
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

  @ApiProperty({
    description: '创建时间',
    example: '2023-05-15 00:00:00',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: '创建时间格式不正确' })
  createTime?: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2023-05-15 00:00:00',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: '更新时间格式不正确' })
  updateTime?: Date;
}
