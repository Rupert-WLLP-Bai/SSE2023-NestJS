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

export class CreateClassDto {
  @ApiProperty({ description: '班级名称', example: '计算机21级1班' })
  @IsNotEmpty({ message: '班级名称不能为空' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '班级代码', example: 'CS2021-1', nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code?: string;

  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  courseId?: number;

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

  @ApiProperty({ description: '学期', example: '春季', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  semester?: string;

  @ApiProperty({ description: '年份', example: 2023, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  @ApiProperty({ description: '最大学生数', example: 60, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  maxStudents?: number;

  @ApiProperty({
    description: '描述',
    example: '计算机科学与技术专业班级',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: '创建时间', example: '2023-01-01 00:00:00' })
  @IsOptional()
  @IsDateString({}, { message: '创建时间格式不正确' })
  createTime?: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01 00:00:00' })
  @IsOptional()
  @IsDateString({}, { message: '更新时间格式不正确' })
  updateTime?: Date;
}
