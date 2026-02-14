import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';

export class CreateTotalScoreDto {
  @ApiProperty({ description: '课程ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ description: '学生ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ description: '总成绩 (0-100)', example: 85 })
  @IsNumber()
  @Min(0)
  @Max(100)
  totalScore: number;

  @ApiProperty({ description: '实验成绩 (0-100)', example: 80, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  experimentScore?: number;

  @ApiProperty({ description: '考试成绩 (0-100)', example: 90, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  examinationScore?: number;
}
