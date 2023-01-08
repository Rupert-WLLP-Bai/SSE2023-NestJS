import { ApiProperty } from '@nestjs/swagger';
import { Notice } from '../entities/notice.entity';
export class QueryNoticeDto {
  // 1. 分页
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  page?: number;
  @ApiProperty({ description: '每页数量', example: 10, nullable: true })
  limit?: number;
  // 2. 排序
  @ApiProperty({
    description: '排序字段',
    example: 'id',
    enum: ['id', 'title', 'content', 'publishDate', 'publisherId', 'publisher'],
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
  // 3. 过滤
  @ApiProperty({
    type: Notice,
    description: '过滤字段',
    example: { id: 2052526 },
    nullable: true,
  })
  filter?: NoticeFilter;
}

export class NoticeFilter {
  @ApiProperty({ description: '公告id', example: 2052526, nullable: true })
  id?: number;
  @ApiProperty({ description: '公告标题', example: '公告标题', nullable: true })
  title?: string;
  @ApiProperty({ description: '公告内容', example: '公告内容', nullable: true })
  content?: string;
  @ApiProperty({
    description: '发布日期',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  publishDate?: Date;
  @ApiProperty({ description: '发布人id', example: 2052526, nullable: true })
  publisherId?: number;
  @ApiProperty({ description: '发布人', example: '发布人', nullable: true })
  publisher?: string;
}
