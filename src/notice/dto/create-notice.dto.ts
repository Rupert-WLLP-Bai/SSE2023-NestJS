// CreateUserDto是一个数据传输对象，它定义了用户的输入数据的类型。
// CreateUserDto是User实体去除了id的类型
// 使用PartialType方法，可以从一个类型中去除一些属性，生成一个新的类型

import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticeDto {
  @ApiProperty({ description: '实验标题', example: '实验1' })
  title?: string;
  @ApiProperty({ description: '实验内容', example: '<p>实验内容</p>' })
  content?: string;
  @ApiProperty({ description: '发布日期', example: '2020-12-12' })
  publishDate?: Date;
  @ApiProperty({ description: '发布人id', example: '1' })
  publisherId?: number;
  @ApiProperty({ description: '发布人', example: 'admin' })
  publisher?: string;
}
