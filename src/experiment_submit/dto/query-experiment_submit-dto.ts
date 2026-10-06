import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ExperimentSubmit } from '../entities/experiment_submit.entity';
export class ExperimentSubmitFiler extends OmitType(ExperimentSubmit, [
  'file',
] as const) {}

export class QueryExperimentSubmitDto {
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
    type: ExperimentSubmitFiler,
    description: '过滤字段',
    example: { id: 2052526 },
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExperimentSubmitFiler)
  filter?: ExperimentSubmitFiler;
}
