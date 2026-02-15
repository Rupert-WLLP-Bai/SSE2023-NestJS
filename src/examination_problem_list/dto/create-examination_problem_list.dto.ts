import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ProblemType } from '../entities/examination_problem_list.entity';

export class CreateExaminationProblemListDto {
  @ApiProperty({ description: '考试ID', example: 1 })
  @IsNumber()
  examinationId: number;

  @ApiProperty({ description: '题目ID', example: 101 })
  @IsNumber()
  problemId: number;

  @ApiProperty({
    description: '题目标题',
    example: '什么是软件工程？',
    required: false,
  })
  @IsOptional()
  @IsString()
  problemTitle?: string;

  @ApiProperty({
    description: '题目内容',
    example: '请简述软件工程的定义',
    required: false,
  })
  @IsOptional()
  @IsString()
  problemContent?: string;

  @ApiProperty({ description: '题目分值', example: 10 })
  @IsOptional()
  @IsNumber()
  problemScore?: number;

  @ApiProperty({
    description: '题目类型',
    example: 'single_choice',
    enum: ProblemType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProblemType)
  problemType?: ProblemType;

  @ApiProperty({ description: '题目顺序', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  problemOrder?: number;

  @ApiProperty({ description: '答案', example: 'A', required: false })
  @IsOptional()
  @IsString()
  answer?: string;

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
