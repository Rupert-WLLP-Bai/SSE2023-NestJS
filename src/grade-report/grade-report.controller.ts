import {
  QueryResponse,
} from '../common/response/response.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  Res,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { GradeReportService } from './grade-report.service';
import { JwtAuthGuard, RolesGuard, Roles } from '../common/guards';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('grade-report')
@ApiBearerAuth('JWT-auth')
@Controller('grade-report')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradeReportController {
  constructor(private readonly gradeReportService: GradeReportService) {}

  @Get('course/:courseId/stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '获取课程成绩统计' })
  @ApiParam({ name: 'courseId', description: '课程ID' })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async getCourseStats(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<any> {
    try {
      const stats = await this.gradeReportService.getCourseStats(courseId);
      return {
        success: true,
        data: stats,
        errorCode: '',
        errorMessage: '',
        showType: 0,
        traceId: '',
        host: '',
      };
    } catch (e) {
      return {
        success: false,
        data: null,
        errorCode: '',
        errorMessage: e.message,
        showType: 0,
        traceId: '',
        host: '',
      };
    }
  }

  @Get('student/:studentId/course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: '获取学生成绩单详情' })
  @ApiParam({ name: 'studentId', description: '学生ID' })
  @ApiParam({ name: 'courseId', description: '课程ID' })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async getStudentGradeDetail(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<any> {
    try {
      const detail =
        await this.gradeReportService.getStudentGradeDetail(studentId, courseId);
      return {
        success: true,
        data: detail,
        errorCode: '',
        errorMessage: '',
        showType: 0,
        traceId: '',
        host: '',
      };
    } catch (e) {
      return {
        success: false,
        data: null,
        errorCode: '',
        errorMessage: e.message,
        showType: 0,
        traceId: '',
        host: '',
      };
    }
  }

  @Get('course/:courseId/export')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '导出课程成绩CSV' })
  @ApiParam({ name: 'courseId', description: '课程ID' })
  @ApiResponse({ status: 200, description: '导出成功' })
  async exportCourseGrades(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const data = await this.gradeReportService.exportCourseGrades(courseId);

      // 构建CSV内容
      const headers = ['学号', '姓名', '实验总分', '考试成绩', '总分', '是否及格'];
      const rows = data.map((row) => [
        row.studentNumber.toString(),
        row.studentName,
        row.experimentTotal.toString(),
        row.examinationTotal.toString(),
        row.totalScore.toString(),
        row.isPassing ? '是' : '否',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      // 设置响应头为文件下载
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=course_${courseId}_grades.csv`,
      );

      // 写入BOM以支持中文
      res.write('\ufeff');
      res.end(csvContent);
    } catch (e) {
      res.status(500).json({
        success: false,
        errorMessage: e.message,
      });
    }
  }
}
