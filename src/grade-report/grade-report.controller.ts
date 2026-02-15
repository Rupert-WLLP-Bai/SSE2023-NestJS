import { QueryResponse } from '../common/response/response.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  Res,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { GradeReportService } from './grade-report.service';
import { JwtAuthGuard, RolesGuard, Roles } from '../common/guards';
import { UserRole } from '../user/entities/user.entity';
import { ExportQueryDto } from './dto/grade-report-query.dto';

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
      const detail = await this.gradeReportService.getStudentGradeDetail(
        studentId,
        courseId,
      );
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
      const headers = [
        '学号',
        '姓名',
        '实验总分',
        '考试成绩',
        '总分',
        '是否及格',
      ];
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

  /**
   * GF-001: 导出Excel成绩单
   * GET /api/grade-report/export/excel?courseId=1&classId=1&semester=2023-1
   */
  @Get('export/excel')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '导出Excel成绩单' })
  @ApiQuery({ name: 'courseId', required: false, description: '课程ID' })
  @ApiQuery({ name: 'classId', required: false, description: '班级ID' })
  @ApiQuery({ name: 'semester', required: false, description: '学期' })
  @ApiResponse({ status: 200, description: '导出成功' })
  async exportExcel(
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const courseId = Number(query.courseId);
      if (!courseId) {
        res.status(400).json({
          success: false,
          errorMessage: '请提供课程ID',
        });
        return;
      }

      const { workbook, courseName, className, semester } =
        await this.gradeReportService.exportExcelData(
          courseId,
          query.classId ? Number(query.classId) : undefined,
          query.semester,
        );

      // 生成文件名
      const filename = `${courseName}_${className}_${semester}.xlsx`.replace(
        /[^a-zA-Z0-9\u4e00-\u9fa5_.-]/g,
        '_',
      );

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (e) {
      res.status(500).json({
        success: false,
        errorMessage: e.message,
      });
    }
  }

  /**
   * GF-002: 导出PDF成绩单
   * GET /api/grade-report/export/pdf?courseId=1&classId=1&semester=2023-1
   */
  @Get('export/pdf')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '导出PDF成绩单' })
  @ApiQuery({ name: 'courseId', required: false, description: '课程ID' })
  @ApiQuery({ name: 'classId', required: false, description: '班级ID' })
  @ApiQuery({ name: 'semester', required: false, description: '学期' })
  @ApiResponse({ status: 200, description: '导出成功' })
  async exportPDF(
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const courseId = Number(query.courseId);
      if (!courseId) {
        res.status(400).json({
          success: false,
          errorMessage: '请提供课程ID',
        });
        return;
      }

      const { courseName, className, studentsData, stats } =
        await this.gradeReportService.getPDFRawData(
          courseId,
          query.classId ? Number(query.classId) : undefined,
        );

      // 创建PDF文档
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      res.setHeader('Content-Type', 'application/pdf');
      const filename = `${courseName}_成绩单.pdf`.replace(
        /[^a-zA-Z0-9\u4e00-\u9fa5_.-]/g,
        '_',
      );
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      doc.pipe(res);

      // 标题
      doc.fontSize(18).text(`${courseName} 成绩单`, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`班级: ${className}`, { align: 'center' });
      doc.moveDown(2);

      // 表格头
      const tableTop = doc.y;
      const colWidths = [80, 80, 80, 80, 80];
      const headers = ['学号', '姓名', '平时成绩', '考试成绩', '总评成绩'];

      doc.fontSize(10);
      let x = 50;
      headers.forEach((header, i) => {
        doc.text(header, x, tableTop, { width: colWidths[i], align: 'center' });
        x += colWidths[i];
      });

      // 表格线
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // 数据行
      let y = tableTop + 20;
      studentsData.forEach((student) => {
        x = 50;
        doc.text(student.studentNumber.toString(), x, y, {
          width: colWidths[0],
          align: 'center',
        });
        x += colWidths[0];
        doc.text(student.studentName, x, y, { width: colWidths[1], align: 'center' });
        x += colWidths[1];
        doc.text(student.experimentScore.toString(), x, y, {
          width: colWidths[2],
          align: 'center',
        });
        x += colWidths[2];
        doc.text(student.examinationScore.toString(), x, y, {
          width: colWidths[3],
          align: 'center',
        });
        x += colWidths[3];
        doc.text(student.totalScore.toString(), x, y, {
          width: colWidths[4],
          align: 'center',
        });
        y += 20;
      });

      // 统计信息
      doc.moveDown(2);
      doc.fontSize(12).text('统计信息', { underline: true });
      doc.fontSize(10);
      doc.text(`总人数: ${stats.total}`);
      doc.text(`平均分: ${stats.average}`);
      doc.text(`最高分: ${stats.max}`);
      doc.text(`最低分: ${stats.min}`);
      doc.text(`及格率: ${stats.passRate}%`);

      doc.end();
    } catch (e) {
      res.status(500).json({
        success: false,
        errorMessage: e.message,
      });
    }
  }

  /**
   * GF-003: 成绩统计分析 - 课程维度
   * GET /api/grade-report/statistics/course/:courseId?semester=2023-1
   */
  @Get('statistics/course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '获取课程成绩统计分析' })
  @ApiParam({ name: 'courseId', description: '课程ID' })
  @ApiQuery({ name: 'semester', required: false, description: '学期' })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async getCourseStatistics(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Query('semester') semester?: string,
  ): Promise<any> {
    try {
      const stats = await this.gradeReportService.getCourseStatistics(courseId);
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

  /**
   * GF-004: 成绩统计分析 - 学生维度
   * GET /api/grade-report/statistics/student/:studentId
   */
  @Get('statistics/student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: '获取学生成绩统计分析' })
  @ApiParam({ name: 'studentId', description: '学生ID' })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async getStudentStatistics(
    @Param('studentId', ParseIntPipe) studentId: number,
  ): Promise<any> {
    try {
      const stats = await this.gradeReportService.getStudentStatistics(studentId);
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

  /**
   * GF-005: 成绩分布统计
   * GET /api/grade-report/distribution/course/:courseId
   */
  @Get('distribution/course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '获取成绩分布统计' })
  @ApiParam({ name: 'courseId', description: '课程ID' })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async getGradeDistribution(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<any> {
    try {
      const distribution = await this.gradeReportService.getGradeDistribution(
        courseId,
      );
      return {
        success: true,
        data: distribution,
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

  /**
   * GF-006: 成绩比对分析
   * GET /api/grade-report/compare?courseId=1&semester1=2023-1&semester2=2023-2
   */
  @Get('compare')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '获取成绩比对分析' })
  @ApiQuery({ name: 'courseId', required: false, description: '课程ID' })
  @ApiQuery({ name: 'semester1', required: false, description: '学期1' })
  @ApiQuery({ name: 'semester2', required: false, description: '学期2' })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async getGradeComparison(
    @Query('courseId') courseId?: string,
    @Query('semester1') semester1?: string,
    @Query('semester2') semester2?: string,
  ): Promise<any> {
    try {
      if (!courseId) {
        return {
          success: false,
          data: null,
          errorCode: '',
          errorMessage: '请提供课程ID',
          showType: 0,
          traceId: '',
          host: '',
        };
      }
      const comparison = await this.gradeReportService.getGradeComparison(
        Number(courseId),
        semester1 || '学期1',
        semester2 || '学期2',
      );
      return {
        success: true,
        data: comparison,
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
}
