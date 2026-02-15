import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class CreateExperimentScoreDto {
  @ApiProperty({ description: '课程ID', example: 1 })
  @IsNotEmpty({ message: '课程ID不能为空' })
  @IsNumber({}, { message: '课程ID必须是数字' })
  @Min(1)
  courseId: number;

  @ApiProperty({ description: '实验ID', example: 1 })
  @IsNotEmpty({ message: '实验ID不能为空' })
  @IsNumber({}, { message: '实验ID必须是数字' })
  @Min(1)
  experimentId: number;

  @ApiProperty({ description: '学生ID', example: 1 })
  @IsNotEmpty({ message: '学生ID不能为空' })
  @IsNumber({}, { message: '学生ID必须是数字' })
  @Min(1)
  studentId: number;

  @ApiProperty({ description: '实验成绩 (0-100)', example: 85 })
  @IsNotEmpty({ message: '成绩不能为空' })
  @IsNumber({}, { message: '成绩必须是数字' })
  @Min(0)
  @Max(100)
  score: number;

  @ApiProperty({ description: '评语', example: '优秀', nullable: true })
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: '评分时间', example: '2023-06-01 00:00:00', nullable: true })
  @IsOptional()
  @IsDateString({}, { message: '评分时间格式不正确' })
  scoredAt?: Date;
}
