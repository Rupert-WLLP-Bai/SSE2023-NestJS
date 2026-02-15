import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class ExportQueryDto {
  @ApiPropertyOptional({ description: '课程ID' })
  @IsOptional()
  @IsNumberString()
  courseId?: string;

  @ApiPropertyOptional({ description: '班级ID' })
  @IsOptional()
  @IsNumberString()
  classId?: string;

  @ApiPropertyOptional({ description: '学期' })
  @IsOptional()
  semester?: string;
}

export class CourseStatsQueryDto {
  @ApiPropertyOptional({ description: '学期' })
  @IsOptional()
  semester?: string;
}

export class CompareQueryDto {
  @ApiPropertyOptional({ description: '课程ID' })
  @IsOptional()
  @IsNumberString()
  courseId?: string;

  @ApiPropertyOptional({ description: '学期1' })
  @IsOptional()
  semester1?: string;

  @ApiPropertyOptional({ description: '学期2' })
  @IsOptional()
  semester2?: string;
}
