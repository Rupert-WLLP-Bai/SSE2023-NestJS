import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Notice } from '../entities/notice.entity';

export class NoticeFilter {
  @ApiProperty({ description: '公告id', example: 2052526, nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;
  @ApiProperty({ description: '公告标题', example: '公告标题', nullable: true })
  @IsOptional()
  @IsString()
  title?: string;
  @ApiProperty({ description: '公告内容', example: '公告内容', nullable: true })
  @IsOptional()
  @IsString()
  content?: string;
  @ApiProperty({
    description: '发布日期',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  publishDate?: Date;
  @ApiProperty({ description: '发布人id', example: 2052526, nullable: true })
  @IsOptional()
  @IsNumber()
  publisherId?: number;
  @ApiProperty({ description: '发布人', example: '发布人', nullable: true })
  @IsOptional()
  @IsString()
  publisher?: string;
}

export class QueryNoticeDto {
  // 1. 分页
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  page?: number;
  @ApiProperty({ description: '每页数量', example: 10, nullable: true })
  @IsOptional()
  @IsNumber()
  limit?: number;
  // 2. 排序
  @ApiProperty({
    description: '排序字段',
    example: 'id',
    enum: ['id', 'title', 'content', 'publishDate', 'publisherId', 'publisher'],
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
  // 3. 过滤
  @ApiProperty({
    type: Notice,
    description: '过滤字段',
    example: { id: 2052526 },
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NoticeFilter)
  filter?: NoticeFilter;
}
