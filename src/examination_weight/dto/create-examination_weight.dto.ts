import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateExaminationWeightDto {
  @ApiProperty({ description: '课程ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ description: '考试ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  examinationId: number;

  @ApiProperty({ description: '考试权重 (0-100)', example: 30 })
  @IsNumber()
  @Min(0)
  @Max(100)
  weight: number;
}
