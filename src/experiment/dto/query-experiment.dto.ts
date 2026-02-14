import { ApiProperty } from '@nestjs/swagger';
import { Experiment } from '../entities/experiment.entity';

export class ExperimentFilter {
  @ApiProperty({ description: '实验id', example: 2052526, nullable: true })
  id?: number;
  @ApiProperty({ description: '实验标题', example: '实验标题', nullable: true })
  title?: string;
  @ApiProperty({
    description: '实验发布者id',
    example: 2052526,
    nullable: true,
  })
  publisherId?: number;
  @ApiProperty({
    description: '实验发布者名称',
    example: '实验发布者名称',
    nullable: true,
  })
  publisherName?: string;
  @ApiProperty({ description: '实验描述', example: '实验描述', nullable: true })
  description?: string;
  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  courseId?: number;
  @ApiProperty({ description: '实验状态', example: 1, nullable: true })
  status?: number;
  @ApiProperty({
    description: '实验开始时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  startTime?: Date;
  @ApiProperty({
    description: '实验结束时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  endTime?: Date;
  @ApiProperty({
    description: '实验创建时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  createTime?: Date;
  @ApiProperty({
    description: '实验更新时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  updateTime?: Date;
}

export class QueryExperimentDto {
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
    type: Experiment,
    description: '过滤字段',
    example: { id: 2052526 },
    nullable: true,
  })
  filter?: ExperimentFilter;
}
