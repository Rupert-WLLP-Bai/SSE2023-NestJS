import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { ExaminationStatus, ExaminationType } from '../entities/examination.entity';

export class ExaminationFilter {
  @ApiProperty({ description: '考试ID', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: '考试标题', example: '期末考试', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '考试描述', example: '期末考试描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '课程ID', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  courseId?: number;

  @ApiProperty({ description: '课程名称', example: '软件工程', required: false })
  @IsOptional()
  @IsString()
  courseName?: string;

  @ApiProperty({ description: '发布者ID', example: 2052526, required: false })
  @IsOptional()
  @IsNumber()
  publisherId?: number;

  @ApiProperty({ description: '发布者名称', example: '教师姓名', required: false })
  @IsOptional()
  @IsString()
  publisherName?: string;

  @ApiProperty({ description: '考试开始时间', example: '2023-06-01 09:00:00', required: false })
  @IsOptional()
  startTime?: Date;

  @ApiProperty({ description: '考试结束时间', example: '2023-06-01 12:00:00', required: false })
  @IsOptional()
  endTime?: Date;

  @ApiProperty({ description: '考试时长（分钟）', example: 180, required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: '总分', example: 100, required: false })
  @IsOptional()
  @IsNumber()
  totalScore?: number;

  @ApiProperty({ description: '及格分数', example: 60, required: false })
  @IsOptional()
  @IsNumber()
  passingScore?: number;

  @ApiProperty({
    description: '考试状态',
    example: 0,
    enum: ExaminationStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExaminationStatus)
  status?: ExaminationStatus;

  @ApiProperty({
    description: '考试类型',
    example: 'online',
    enum: ExaminationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExaminationType)
  type?: ExaminationType;

  @ApiProperty({ description: '创建时间', example: '2023-05-15 00:00:00', required: false })
  @IsOptional()
  createTime?: Date;

  @ApiProperty({ description: '更新时间', example: '2023-05-15 00:00:00', required: false })
  @IsOptional()
  updateTime?: Date;
}

export class QueryExaminationDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({
    description: '排序字段',
    example: 'id',
    enum: ['id', 'title', 'startTime', 'endTime', 'createTime', 'updateTime'],
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({
    description: '排序方式',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    required: false,
  })
  @IsOptional()
  order?: 'ASC' | 'DESC';

  @ApiProperty({
    type: ExaminationFilter,
    description: '过滤字段',
    example: { courseId: 1, status: 0 },
    required: false,
  })
  @IsOptional()
  filter?: ExaminationFilter;
}
