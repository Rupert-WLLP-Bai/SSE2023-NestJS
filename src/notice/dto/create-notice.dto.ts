import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({ description: '实验标题', example: '实验1' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({ description: '实验内容', example: '<p>实验内容</p>' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;

  @ApiProperty({ description: '发布日期', example: '2020-12-12' })
  @IsOptional()
  @IsDateString({}, { message: '发布日期格式不正确' })
  publishDate?: Date;

  @ApiProperty({ description: '发布人id', example: '1' })
  @IsOptional()
  @IsInt()
  @Min(1)
  publisherId?: number;

  @ApiProperty({ description: '发布人', example: 'admin' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  publisher?: string;
}
