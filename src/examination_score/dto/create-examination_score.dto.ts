import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateExaminationScoreDto {
  @ApiProperty({ description: '课程ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ description: '考试ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  examinationId: number;

  @ApiProperty({ description: '学生ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ description: '题目ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  problemId: number;

  @ApiProperty({ description: '考试成绩 (0-100)', example: 90 })
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;
}
