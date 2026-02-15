import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsInt,
} from 'class-validator';

export class CreateExperimentSubmitDto {
  @ApiProperty({ description: '实验ID', example: 1, required: true })
  @IsNotEmpty({ message: '实验ID不能为空' })
  @IsNumber({}, { message: '实验ID必须是数字' })
  @Min(1)
  experimentId: number;

  @ApiProperty({ description: '学生ID', example: 2052526, required: true })
  @IsNotEmpty({ message: '学生ID不能为空' })
  @IsNumber({}, { message: '学生ID必须是数字' })
  @Min(1)
  studentId: number;

  @ApiProperty({
    description: '时间戳',
    example: Date.now(),
    required: true,
  })
  @IsNotEmpty({ message: '时间戳不能为空' })
  timeStamp: bigint;

  @ApiProperty({
    description: '文件',
    example: 'file',
    required: false,
    format: 'binary',
    type: 'string',
  })
  @IsOptional()
  file?: Express.Multer.File;

  @ApiProperty({
    description: '文件URL',
    example: 'http://xxx',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiProperty({ description: '文件名', required: false, readOnly: true })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ description: '文件大小', required: false, readOnly: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  fileSize?: number;

  @ApiProperty({ description: '文件类型', required: false, readOnly: true })
  @IsOptional()
  @IsString()
  mineType?: string;

  @ApiProperty({ description: '文件字段名', required: false, readOnly: true })
  @IsOptional()
  @IsString()
  fieldname?: string;

  @ApiProperty({ description: '文件编码', required: false, readOnly: true })
  @IsOptional()
  @IsString()
  encoding?: string;
}
