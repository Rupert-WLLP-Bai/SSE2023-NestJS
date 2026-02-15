import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: '课程名称', example: '数据结构' })
  @IsNotEmpty({ message: '课程名称不能为空' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '课程代码', example: 'CS301', nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code?: string;

  @ApiProperty({
    description: '课程描述',
    example: '学习数据结构的基本概念和算法',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: '教师ID', example: 2052526, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  teacherId?: number;

  @ApiProperty({ description: '教师名称', example: '张三', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  teacherName?: string;

  @ApiProperty({ description: '学分', example: 3, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  credit?: number;

  @ApiProperty({ description: '创建时间', example: '2021-01-01 00:00:00' })
  @IsOptional()
  @IsDateString({}, { message: '创建时间格式不正确' })
  createTime?: Date;

  @ApiProperty({ description: '更新时间', example: '2021-01-01 00:00:00' })
  @IsOptional()
  @IsDateString({}, { message: '更新时间格式不正确' })
  updateTime?: Date;
}
