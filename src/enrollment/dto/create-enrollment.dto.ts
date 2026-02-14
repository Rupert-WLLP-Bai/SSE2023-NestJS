import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({ description: '学生ID', example: 2052526 })
  studentId: number;

  @ApiProperty({ description: '学生名称', example: '张三', nullable: true })
  studentName?: string;

  @ApiProperty({ description: '班级ID', example: 1 })
  classId: number;

  @ApiProperty({ description: '班级名称', example: '计算机21级1班', nullable: true })
  className?: string;

  @ApiProperty({ description: '课程ID', example: 1, nullable: true })
  courseId?: number;

  @ApiProperty({ description: '课程名称', example: '数据结构', nullable: true })
  courseName?: string;

  @ApiProperty({ description: '状态', example: 'active', nullable: true })
  status?: string;

  @ApiProperty({ description: '选课日期', example: '2023-01-01', nullable: true })
  enrollmentDate?: Date;

  @ApiProperty({ description: '退课日期', example: '2023-01-01', nullable: true })
  dropDate?: Date;

  @ApiProperty({ description: '成绩', example: 90, nullable: true })
  grade?: number;

  @ApiProperty({ description: '备注', example: '优秀学生', nullable: true })
  comment?: string;

  @ApiProperty({ description: '创建时间', example: '2023-01-01 00:00:00' })
  createTime: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01 00:00:00' })
  updateTime: Date;
}
