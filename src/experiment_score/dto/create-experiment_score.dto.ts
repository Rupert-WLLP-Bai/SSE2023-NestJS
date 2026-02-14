import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateExperimentScoreDto {
  @ApiProperty({ description: '课程ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ description: '实验ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  experimentId: number;

  @ApiProperty({ description: '学生ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ description: '实验成绩 (0-100)', example: 85 })
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;
}
