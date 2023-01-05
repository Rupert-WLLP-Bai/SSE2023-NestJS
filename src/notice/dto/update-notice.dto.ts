import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateNoticeDto } from './create-notice.dto';

export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {
  @ApiProperty({ description: '实验标题', example: '实验1' })
  title: string;
  @ApiProperty({ description: '实验内容', example: '<p>实验内容</p>' })
  content: string;
  @ApiProperty({ description: '发布日期', example: '2020-12-12' })
  publishDate: Date;
  @ApiProperty({ description: '发布人id', example: '1' })
  publisherId: number;
  @ApiProperty({ description: '发布人', example: 'admin' })
  publisher: string;
}
