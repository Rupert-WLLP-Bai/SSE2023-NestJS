import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateTotalWeightDto {
  @ApiProperty({ description: '课程ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ description: '实验权重 (0-100)', example: 40 })
  @IsNumber()
  @Min(0)
  @Max(100)
  experimentWeight: number;

  @ApiProperty({ description: '考试权重 (0-100)', example: 60 })
  @IsNumber()
  @Min(0)
  @Max(100)
  examinationWeight: number;
}
