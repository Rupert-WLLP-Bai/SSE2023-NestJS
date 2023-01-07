import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateExperimentDto } from './create-experiment.dto';

export class UpdateExperimentDto extends PartialType(CreateExperimentDto) {
  @ApiProperty({ description: '实验名称', example: '实验1' })
  title: string;
  @ApiProperty({ description: '实验发布者id', example: 2052526 })
  publisherId: number;
  @ApiProperty({ description: '实验发布者名称', example: 'Junhao Bai' })
  publisherName: string;
  @ApiProperty({ description: '实验描述', example: '这是一个实验' })
  description: string;
  @ApiProperty({ description: '实验状态', example: 1 })
  status: number;
  @ApiProperty({ description: '实验开始时间', example: '2021-01-01 00:00:00' })
  startTime: Date;
  @ApiProperty({ description: '实验结束时间', example: '2021-01-03 00:00:00' })
  endTime: Date;
  @ApiProperty({ description: '实验创建时间', example: '2020-12-31 00:00:00' })
  createTime: Date;
  @ApiProperty({ description: '实验更新时间', example: '2021-01-01 00:00:00' })
  updateTime: Date;
}
