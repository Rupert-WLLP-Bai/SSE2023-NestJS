import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateExperimentWeightDto {
  @ApiProperty({ description: '课程ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ description: '实验ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  experimentId: number;

  @ApiProperty({ description: '实验权重 (0-100)', example: 20 })
  @IsNumber()
  @Min(0)
  @Max(100)
  weight: number;
}
