import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional, IsString, IsEnum, Min, Max } from 'class-validator';
import { SubmitStatus } from '../entities/examination_submit.entity';

export class CreateExaminationSubmitDto {
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

  @ApiProperty({ description: '答案', example: '这是我的答案', required: false })
  @IsString()
  @IsOptional()
  answer?: string;

  @ApiProperty({ description: '文件URL', example: 'https://qiniu.com/file/xxx', required: false })
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiProperty({ description: '提交状态', enum: SubmitStatus, example: SubmitStatus.SUBMITTED, required: false })
  @IsEnum(SubmitStatus)
  @IsOptional()
  status?: SubmitStatus;

  @ApiProperty({ description: '分数 (0-100)', example: 85, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiProperty({ description: '反馈', example: '回答得很好', required: false })
  @IsString()
  @IsOptional()
  feedback?: string;
}
