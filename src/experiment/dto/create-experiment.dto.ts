import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateExperimentDto {
  @ApiProperty({ description: '实验名称', example: '实验1' })
  @IsNotEmpty({ message: '实验名称不能为空' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: '实验发布者id', example: 2052526 })
  @IsNotEmpty({ message: '发布者ID不能为空' })
  @IsInt()
  @Min(1)
  publisherId: number;

  @ApiProperty({ description: '实验发布者名称', example: 'Junhao Bai' })
  @IsNotEmpty({ message: '发布者名称不能为空' })
  @IsString()
  @MaxLength(50)
  publisherName: string;

  @ApiProperty({ description: '实验描述', example: '这是一个实验' })
  @IsNotEmpty({ message: '实验描述不能为空' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  courseId?: number;

  @ApiProperty({ description: '实验状态', example: 1 })
  @IsNotEmpty({ message: '实验状态不能为空' })
  @IsInt()
  @Min(0)
  @Max(10)
  status: number;

  @ApiProperty({ description: '实验开始时间', example: '2021-01-01 00:00:00' })
  @IsNotEmpty({ message: '开始时间不能为空' })
  @IsDateString({}, { message: '开始时间格式不正确' })
  startTime: Date;

  @ApiProperty({ description: '实验结束时间', example: '2021-01-03 00:00:00' })
  @IsNotEmpty({ message: '结束时间不能为空' })
  @IsDateString({}, { message: '结束时间格式不正确' })
  endTime: Date;

  @ApiProperty({ description: '实验创建时间', example: '2020-12-31 00:00:00' })
  @IsOptional()
  @IsDateString({}, { message: '创建时间格式不正确' })
  createTime?: Date;

  @ApiProperty({ description: '实验更新时间', example: '2021-01-01 00:00:00' })
  @IsOptional()
  @IsDateString({}, { message: '更新时间格式不正确' })
  updateTime?: Date;
}
