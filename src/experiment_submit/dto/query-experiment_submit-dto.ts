import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ExperimentSubmit } from '../entities/experiment_submit.entity';
export class ExperimentSubmitFiler extends OmitType(ExperimentSubmit, [
  'file',
] as const) {}

export class QueryExperimentSubmitDto {
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  page?: number;
  @ApiProperty({ description: '每页数量', example: 10, nullable: true })
  limit?: number;
  @ApiProperty({
    description: '排序字段',
    example: 'id',
    enum: ['id', 'name', 'description', 'createDate', 'updateDate'],
    nullable: true,
  })
  sort?: string;
  @ApiProperty({
    description: '排序方式',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    nullable: true,
  })
  order?: 'ASC' | 'DESC';
  @ApiProperty({
    type: ExperimentSubmitFiler,
    description: '过滤字段',
    example: { id: 2052526 },
    nullable: true,
  })
  filter?: ExperimentSubmitFiler;
}
