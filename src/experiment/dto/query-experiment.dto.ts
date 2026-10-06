import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Experiment } from '../entities/experiment.entity';

export class ExperimentFilter {
  @ApiProperty({ description: '实验id', example: 2052526, nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;
  @ApiProperty({ description: '实验标题', example: '实验标题', nullable: true })
  @IsOptional()
  @IsString()
  title?: string;
  @ApiProperty({
    description: '实验发布者id',
    example: 2052526,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  publisherId?: number;
  @ApiProperty({
    description: '实验发布者名称',
    example: '实验发布者名称',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  publisherName?: string;
  @ApiProperty({ description: '实验描述', example: '实验描述', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  courseId?: number;
  @ApiProperty({ description: '实验状态', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  status?: number;
  @ApiProperty({
    description: '实验开始时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  startTime?: Date;
  @ApiProperty({
    description: '实验结束时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  endTime?: Date;
  @ApiProperty({
    description: '实验创建时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  createTime?: Date;
  @ApiProperty({
    description: '实验更新时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  updateTime?: Date;
}

export class QueryExperimentDto {
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  page?: number;
  @ApiProperty({ description: '每页数量', example: 10, nullable: true })
  @IsOptional()
  @IsNumber()
  limit?: number;
  @ApiProperty({
    description: '排序字段',
    example: 'id',
    enum: ['id', 'name', 'description', 'createDate', 'updateDate'],
    nullable: true,
  })
  @IsOptional()
  @IsString()
  sort?: string;
  @ApiProperty({
    description: '排序方式',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    nullable: true,
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
  @ApiProperty({
    type: Experiment,
    description: '过滤字段',
    example: { id: 2052526 },
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExperimentFilter)
  filter?: ExperimentFilter;
}
