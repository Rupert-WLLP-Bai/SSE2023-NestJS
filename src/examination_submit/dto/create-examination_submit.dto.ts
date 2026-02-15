import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  Min,
  Max,
  Length,
} from 'class-validator';
import { SubmitStatus } from '../entities/examination_submit.entity';

export class CreateExaminationSubmitDto {
  @ApiProperty({ description: '考试ID', example: 1 })
  @IsNotEmpty({ message: '考试ID不能为空' })
  @IsNumber({}, { message: '考试ID必须是数字' })
  @Min(1)
  examinationId: number;

  @ApiProperty({ description: '学生ID', example: 1 })
  @IsNotEmpty({ message: '学生ID不能为空' })
  @IsNumber({}, { message: '学生ID必须是数字' })
  @Min(1)
  studentId: number;

  @ApiProperty({ description: '题目ID', example: 1, nullable: true })
  @IsOptional()
  @IsNumber({}, { message: '题目ID必须是数字' })
  @Min(1)
  problemId?: number;

  @ApiProperty({
    description: '答案',
    example: '这是我的答案',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Max(5000)
  answer?: string;

  @ApiProperty({
    description: '文件URL',
    example: 'https://qiniu.com/file/xxx',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  fileUrl?: string;

  @ApiProperty({
    description: '提交状态',
    enum: SubmitStatus,
    example: SubmitStatus.SUBMITTED,
    required: false,
  })
  @IsOptional()
  @IsEnum(SubmitStatus)
  status?: SubmitStatus;

  @ApiProperty({ description: '分数 (0-100)', example: 85, required: false })
  @IsOptional()
  @IsNumber({}, { message: '分数必须是数字' })
  @Min(0)
  @Max(100)
  score?: number;

  @ApiProperty({ description: '反馈', example: '回答得很好', required: false })
  @IsOptional()
  @IsString()
  @Max(500)
  feedback?: string;
}
