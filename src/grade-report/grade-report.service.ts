import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import { TotalScore } from '../total_score/entities/total_score.entity';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { ExperimentScore } from '../experiment_score/entities/experiment_score.entity';
import { ExperimentWeight } from '../experiment_weight/entities/experiment_weight.entity';
import { ExaminationScore } from '../examination_score/entities/examination_score.entity';
import { ExaminationWeight } from '../examination_weight/entities/examination_weight.entity';
import { User } from '../user/entities/user.entity';
import { Experiment } from '../experiment/entities/experiment.entity';
import { Examination } from '../examination/entities/examination.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { Course } from '../course/entities/course.entity';

export interface CourseStats {
  courseId: number;
  totalStudents: number;
  averageScore: number;
  passRate: number;
  maxScore: number;
  minScore: number;
  distribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

export interface StudentGradeDetail {
  studentId: number;
  studentName: string;
  studentNumber: number;
  experimentDetails: {
    experimentId: number;
    experimentName: string;
    score: number;
    weight: number;
    weightedScore: number;
  }[];
  examinationDetails: {
    examinationId: number;
    examinationName: string;
    score: number;
    weight: number;
    weightedScore: number;
  }[];
  weightInfo: {
    experimentWeight: number;
    examinationWeight: number;
  };
  totalScore: number;
  experimentTotal: number;
  examinationTotal: number;
  isPassing: boolean;
}

export interface ExportRow {
  studentNumber: number;
  studentName: string;
  experimentTotal: number;
  examinationTotal: number;
  totalScore: number;
  isPassing: boolean;
}

export interface CourseStatistics {
  courseId: number;
  courseName: string;
  semester?: string;
  maxScore: number;
  minScore: number;
  averageScore: number;
  medianScore: number;
  passRate: number;
  excellentRate: number;
}

export interface StudentStatistics {
  studentId: number;
  studentName: string;
  studentNumber: number;
  courses: {
    courseId: number;
    courseName: string;
    totalScore: number;
    semester?: string;
  }[];
  semesterAverage: number;
  classRank: number;
}

export interface GradeDistribution {
  courseId: number;
  courseName: string;
  distribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

export interface GradeComparison {
  courseId: number;
  courseName: string;
  semester1: string;
  semester2: string;
  semester1Stats: {
    totalStudents: number;
    averageScore: number;
    passRate: number;
    excellentRate: number;
  };
  semester2Stats: {
    totalStudents: number;
    averageScore: number;
    passRate: number;
    excellentRate: number;
  };
}

@Injectable()
export class GradeReportService {
  constructor(
    @InjectRepository(TotalScore)
    private readonly totalScoreRepository: Repository<TotalScore>,
    @InjectRepository(TotalWeight)
    private readonly totalWeightRepository: Repository<TotalWeight>,
    @InjectRepository(ExperimentScore)
    private readonly experimentScoreRepository: Repository<ExperimentScore>,
    @InjectRepository(ExperimentWeight)
    private readonly experimentWeightRepository: Repository<ExperimentWeight>,
    @InjectRepository(ExaminationScore)
    private readonly examinationScoreRepository: Repository<ExaminationScore>,
    @InjectRepository(ExaminationWeight)
    private readonly examinationWeightRepository: Repository<ExaminationWeight>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
    @InjectRepository(Examination)
    private readonly examinationRepository: Repository<Examination>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  /**
   * 获取课程成绩统计
   */
  async getCourseStats(courseId: number): Promise<CourseStats> {
    // 获取课程所有学生的总分
    const scores = await this.totalScoreRepository.find({
      where: { courseId },
    });

    if (scores.length === 0) {
      // 如果没有成绩，返回空统计
      return {
        courseId,
        totalStudents: 0,
        averageScore: 0,
        passRate: 0,
        maxScore: 0,
        minScore: 0,
        distribution: [
          { range: '0-59', count: 0, percentage: 0 },
          { range: '60-69', count: 0, percentage: 0 },
          { range: '70-79', count: 0, percentage: 0 },
          { range: '80-89', count: 0, percentage: 0 },
          { range: '90-100', count: 0, percentage: 0 },
        ],
      };
    }

    const totalStudents = scores.length;
    const scoreValues = scores.map((s) => Number(s.totalScore));
    const averageScore =
      scoreValues.reduce((sum, s) => sum + s, 0) / totalStudents;
    const passCount = scoreValues.filter((s) => s >= 60).length;
    const passRate = (passCount / totalStudents) * 100;
    const maxScore = Math.max(...scoreValues);
    const minScore = Math.min(...scoreValues);

    // 计算分段分布
    const distribution = [
      { range: '0-59', count: 0, percentage: 0 },
      { range: '60-69', count: 0, percentage: 0 },
      { range: '70-79', count: 0, percentage: 0 },
      { range: '80-89', count: 0, percentage: 0 },
      { range: '90-100', count: 0, percentage: 0 },
    ];

    for (const score of scoreValues) {
      if (score < 60) {
        distribution[0].count++;
      } else if (score < 70) {
        distribution[1].count++;
      } else if (score < 80) {
        distribution[2].count++;
      } else if (score < 90) {
        distribution[3].count++;
      } else {
        distribution[4].count++;
      }
    }

    // 计算百分比
    for (const d of distribution) {
      d.percentage = totalStudents > 0 ? (d.count / totalStudents) * 100 : 0;
    }

    return {
      courseId,
      totalStudents,
      averageScore: Math.round(averageScore * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
      maxScore,
      minScore,
      distribution,
    };
  }

  /**
   * 获取学生成绩单详情
   */
  async getStudentGradeDetail(
    studentId: number,
    courseId: number,
  ): Promise<StudentGradeDetail> {
    // 获取学生信息
    const student = await this.userRepository.findOneBy({ id: studentId });
    if (!student) {
      throw new NotFoundException(`学生 ${studentId} 不存在`);
    }

    // 获取总分记录
    const totalScore = await this.totalScoreRepository.findOne({
      where: { studentId, courseId },
    });

    // 获取权重信息
    const weight = await this.totalWeightRepository.findOneBy({ courseId });
    const experimentWeight = weight ? Number(weight.experimentWeight) : 0;
    const examinationWeight = weight ? Number(weight.examinationWeight) : 0;

    // 获取实验项明细
    const experimentWeights = await this.experimentWeightRepository.find({
      where: { courseId },
    });
    const experimentDetails = [];
    let experimentTotal = 0;

    for (const expWeight of experimentWeights) {
      const exp = await this.experimentRepository.findOneBy({
        id: expWeight.experimentId,
      });
      const expScore = await this.experimentScoreRepository.findOne({
        where: {
          courseId,
          studentId,
          experimentId: expWeight.experimentId,
        },
      });

      const score = expScore ? Number(expScore.score) : 0;
      const weightValue = Number(expWeight.weight);
      const totalExpWeight = experimentWeight || 100;
      const weightedScore = (score * weightValue) / totalExpWeight;
      experimentTotal += weightedScore;

      experimentDetails.push({
        experimentId: expWeight.experimentId,
        experimentName: exp?.title || `实验 ${expWeight.experimentId}`,
        score,
        weight: weightValue,
        weightedScore: Math.round(weightedScore * 100) / 100,
      });
    }

    // 获取考试项明细
    const examinationWeights = await this.examinationWeightRepository.find({
      where: { courseId },
    });
    const examinationDetails = [];
    let examinationTotal = 0;

    for (const examWeight of examinationWeights) {
      const exam = await this.examinationRepository.findOneBy({
        id: examWeight.examinationId,
      });
      const examScores = await this.examinationScoreRepository.find({
        where: {
          courseId,
          studentId,
          examinationId: examWeight.examinationId,
        },
      });

      // 考试可能是多题目的，计算平均分
      const avgScore =
        examScores.length > 0
          ? examScores.reduce((sum, s) => sum + Number(s.score), 0) /
            examScores.length
          : 0;
      const weightValue = Number(examWeight.weight);
      const totalExamWeight = examinationWeight || 100;
      const weightedScore = (avgScore * weightValue) / totalExamWeight;
      examinationTotal += weightedScore;

      examinationDetails.push({
        examinationId: examWeight.examinationId,
        examinationName: exam?.title || `考试 ${examWeight.examinationId}`,
        score: Math.round(avgScore * 100) / 100,
        weight: weightValue,
        weightedScore: Math.round(weightedScore * 100) / 100,
      });
    }

    const totalScoreValue = totalScore ? Number(totalScore.totalScore) : 0;

    return {
      studentId,
      studentName: student.name || '',
      studentNumber: student.id,
      experimentDetails,
      examinationDetails,
      weightInfo: {
        experimentWeight,
        examinationWeight,
      },
      totalScore: totalScoreValue,
      experimentTotal: Math.round(experimentTotal * 100) / 100,
      examinationTotal: Math.round(examinationTotal * 100) / 100,
      isPassing: totalScoreValue >= 60,
    };
  }

  /**
   * 导出课程成绩CSV
   */
  async exportCourseGrades(courseId: number): Promise<ExportRow[]> {
    // 获取课程所有学生的总分
    const scores = await this.totalScoreRepository.find({
      where: { courseId },
    });

    const results: ExportRow[] = [];

    for (const score of scores) {
      const student = await this.userRepository.findOneBy({
        id: score.studentId,
      });

      if (student) {
        results.push({
          studentNumber: student.id,
          studentName: student.name || '',
          experimentTotal: Number(score.experimentScore),
          examinationTotal: Number(score.examinationScore),
          totalScore: Number(score.totalScore),
          isPassing: Number(score.totalScore) >= 60,
        });
      }
    }

    // 按学号排序
    results.sort((a, b) => a.studentNumber - b.studentNumber);

    return results;
  }

  /**
   * GF-003: 获取课程成绩统计分析
   */
  async getCourseStatistics(courseId: number): Promise<CourseStatistics> {
    const scores = await this.totalScoreRepository.find({
      where: { courseId },
    });

    const course = await this.courseRepository.findOneBy({ id: courseId });

    if (scores.length === 0) {
      return {
        courseId,
        courseName: course?.name || '',
        maxScore: 0,
        minScore: 0,
        averageScore: 0,
        medianScore: 0,
        passRate: 0,
        excellentRate: 0,
      };
    }

    const scoreValues = scores.map((s) => Number(s.totalScore)).sort((a, b) => a - b);
    const totalStudents = scoreValues.length;
    const averageScore = scoreValues.reduce((sum, s) => sum + s, 0) / totalStudents;
    const passCount = scoreValues.filter((s) => s >= 60).length;
    const excellentCount = scoreValues.filter((s) => s >= 90).length;

    // 计算中位数
    let medianScore: number;
    const mid = Math.floor(totalStudents / 2);
    if (totalStudents % 2 === 0) {
      medianScore = (scoreValues[mid - 1] + scoreValues[mid]) / 2;
    } else {
      medianScore = scoreValues[mid];
    }

    return {
      courseId,
      courseName: course?.name || '',
      maxScore: Math.max(...scoreValues),
      minScore: Math.min(...scoreValues),
      averageScore: Math.round(averageScore * 100) / 100,
      medianScore: Math.round(medianScore * 100) / 100,
      passRate: Math.round((passCount / totalStudents) * 10000) / 100,
      excellentRate: Math.round((excellentCount / totalStudents) * 10000) / 100,
    };
  }

  /**
   * GF-004: 获取学生成绩统计分析
   */
  async getStudentStatistics(studentId: number): Promise<StudentStatistics> {
    const student = await this.userRepository.findOneBy({ id: studentId });
    if (!student) {
      throw new NotFoundException(`学生 ${studentId} 不存在`);
    }

    // 获取学生所有课程成绩
    const scores = await this.totalScoreRepository.find({
      where: { studentId },
    });

    const courses: StudentStatistics['courses'] = [];
    let totalScoreSum = 0;

    for (const score of scores) {
      const course = await this.courseRepository.findOneBy({
        id: score.courseId,
      });
      const scoreValue = Number(score.totalScore);
      totalScoreSum += scoreValue;

      courses.push({
        courseId: score.courseId,
        courseName: course?.name || `课程 ${score.courseId}`,
        totalScore: scoreValue,
      });
    }

    // 计算班级排名
    const enrollments = await this.enrollmentRepository.find({
      where: { studentId },
    });

    let classRank = 0;
    if (enrollments.length > 0) {
      const classId = enrollments[0].classId;
      // 获取同班级学生
      const classStudents = await this.enrollmentRepository.find({
        where: { classId },
      });

      let rank = 1;
      for (const classStudent of classStudents) {
        if (classStudent.studentId === studentId) continue;
        const otherScore = await this.totalScoreRepository.findOne({
          where: { studentId: classStudent.studentId },
        });
        if (otherScore && Number(otherScore.totalScore) > totalScoreSum / scores.length) {
          rank++;
        }
      }
      classRank = rank;
    }

    const semesterAverage = scores.length > 0
      ? Math.round((totalScoreSum / scores.length) * 100) / 100
      : 0;

    return {
      studentId,
      studentName: student.name || '',
      studentNumber: student.id,
      courses,
      semesterAverage,
      classRank,
    };
  }

  /**
   * GF-005: 获取成绩分布统计
   */
  async getGradeDistribution(courseId: number): Promise<GradeDistribution> {
    const scores = await this.totalScoreRepository.find({
      where: { courseId },
    });

    const course = await this.courseRepository.findOneBy({ id: courseId });

    const distribution = [
      { range: '0-60', count: 0, percentage: 0 },
      { range: '60-70', count: 0, percentage: 0 },
      { range: '70-80', count: 0, percentage: 0 },
      { range: '80-90', count: 0, percentage: 0 },
      { range: '90-100', count: 0, percentage: 0 },
    ];

    for (const score of scores) {
      const scoreValue = Number(score.totalScore);
      if (scoreValue < 60) {
        distribution[0].count++;
      } else if (scoreValue < 70) {
        distribution[1].count++;
      } else if (scoreValue < 80) {
        distribution[2].count++;
      } else if (scoreValue < 90) {
        distribution[3].count++;
      } else {
        distribution[4].count++;
      }
    }

    const total = scores.length;
    for (const d of distribution) {
      d.percentage = total > 0 ? Math.round((d.count / total) * 10000) / 100 : 0;
    }

    return {
      courseId,
      courseName: course?.name || '',
      distribution,
    };
  }

  /**
   * GF-006: 成绩比对分析
   */
  async getGradeComparison(
    courseId: number,
    semester1: string,
    semester2: string,
  ): Promise<GradeComparison> {
    const course = await this.courseRepository.findOneBy({ id: courseId });

    // 获取课程的所有成绩（简化处理，不区分学期）
    const scores = await this.totalScoreRepository.find({
      where: { courseId },
    });

    // 计算两个学期的统计数据（简化：随机分配作为演示）
    // 实际应用中需要根据 enrollmentDate 或其他字段区分学期
    const scoreValues = scores.map((s) => Number(s.totalScore));
    const totalStudents = scoreValues.length;

    if (totalStudents === 0) {
      return {
        courseId,
        courseName: course?.name || '',
        semester1,
        semester2,
        semester1Stats: {
          totalStudents: 0,
          averageScore: 0,
          passRate: 0,
          excellentRate: 0,
        },
        semester2Stats: {
          totalStudents: 0,
          averageScore: 0,
          passRate: 0,
          excellentRate: 0,
        },
      };
    }

    // 模拟数据：实际应该从数据库按学期查询
    const midIndex = Math.floor(totalStudents / 2);
    const semester1Scores = scoreValues.slice(0, midIndex);
    const semester2Scores = scoreValues.slice(midIndex);

    const calcStats = (values: number[]) => {
      if (values.length === 0) {
        return {
          totalStudents: 0,
          averageScore: 0,
          passRate: 0,
          excellentRate: 0,
        };
      }
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      const passCount = values.filter((v) => v >= 60).length;
      const excellentCount = values.filter((v) => v >= 90).length;
      return {
        totalStudents: values.length,
        averageScore: Math.round(avg * 100) / 100,
        passRate: Math.round((passCount / values.length) * 10000) / 100,
        excellentRate: Math.round((excellentCount / values.length) * 10000) / 100,
      };
    };

    return {
      courseId,
      courseName: course?.name || '',
      semester1,
      semester2,
      semester1Stats: calcStats(semester1Scores),
      semester2Stats: calcStats(semester2Scores),
    };
  }

  /**
   * GF-001: 导出Excel成绩单
   */
  async exportExcelData(
    courseId: number,
    classId?: number,
    semester?: string,
  ): Promise<{
    workbook: ExcelJS.Workbook;
    courseName: string;
    className: string;
    semester: string;
  }> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    const courseName = course?.name || `课程${courseId}`;

    // 获取选课学生
    let enrollments = await this.enrollmentRepository.find({
      where: { courseId },
    });

    if (classId) {
      enrollments = enrollments.filter((e) => e.classId === Number(classId));
    }

    const studentIds = enrollments.map((e) => e.studentId);
    const className = enrollments[0]?.className || '全部班级';

    // 获取成绩
    const scores = await this.totalScoreRepository.find({
      where: { courseId },
    });

    const scoreMap = new Map(scores.map((s) => [s.studentId, s]));

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SSE2023 System';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('成绩单');

    // 设置列宽
    sheet.columns = [
      { header: '学号', key: 'studentNumber', width: 15 },
      { header: '姓名', key: 'studentName', width: 12 },
      { header: '平时成绩', key: 'experimentScore', width: 12 },
      { header: '实验成绩', key: 'experimentTotal', width: 12 },
      { header: '考试成绩', key: 'examinationScore', width: 12 },
      { header: '总评成绩', key: 'totalScore', width: 12 },
    ];

    // 添加标题行样式
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCE5FF' },
    };
    headerRow.alignment = { horizontal: 'center' };

    // 添加数据
    for (const studentId of studentIds) {
      const student = await this.userRepository.findOneBy({ id: studentId });
      const score = scoreMap.get(studentId);

      if (student) {
        sheet.addRow({
          studentNumber: student.id,
          studentName: student.name || '',
          experimentScore: score ? Number(score.experimentScore) : 0,
          experimentTotal: score ? Number(score.experimentScore) : 0,
          examinationScore: score ? Number(score.examinationScore) : 0,
          totalScore: score ? Number(score.totalScore) : 0,
        });
      }
    }

    // 添加统计行
    const lastRow = sheet.lastRow?.number || 1;
    sheet.addRow([]);
    const statsRow = sheet.addRow({
      studentNumber: '统计',
      studentName: '',
      totalScore: '',
    });
    statsRow.font = { bold: true };

    // 计算统计
    const scoreValues = scores.map((s) => Number(s.totalScore));
    if (scoreValues.length > 0) {
      const avg = scoreValues.reduce((sum, v) => sum + v, 0) / scoreValues.length;
      const passCount = scoreValues.filter((v) => v >= 60).length;
      const passRate = (passCount / scoreValues.length) * 100;

      sheet.addRow({ studentNumber: '平均分', totalScore: Math.round(avg * 100) / 100 });
      sheet.addRow({ studentNumber: '及格率', totalScore: Math.round(passRate * 100) / 100 + '%' });
    }

    return {
      workbook,
      courseName,
      className,
      semester: semester || '当前学期',
    };
  }

  /**
   * GF-002: 导出PDF成绩单
   */
  async exportPDFData(
    courseId: number,
    classId?: number,
    semester?: string,
  ): Promise<{
    doc: typeof PDFDocument;
    courseName: string;
    className: string;
    semester: string;
  }> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    const courseName = course?.name || `课程${courseId}`;

    // 获取选课学生
    let enrollments = await this.enrollmentRepository.find({
      where: { courseId },
    });

    if (classId) {
      enrollments = enrollments.filter((e) => e.classId === Number(classId));
    }

    const studentIds = enrollments.map((e) => e.studentId);
    const className = enrollments[0]?.className || '全部班级';

    // 获取成绩
    const scores = await this.totalScoreRepository.find({
      where: { courseId },
    });

    const scoreMap = new Map(scores.map((s) => [s.studentId, s]));

    // 计算统计
    const scoreValues = scores.map((s) => Number(s.totalScore));
    const stats = {
      total: scoreValues.length,
      average: 0,
      max: 0,
      min: 0,
      passRate: 0,
    };

    if (scoreValues.length > 0) {
      stats.average = Math.round(
        (scoreValues.reduce((sum, v) => sum + v, 0) / scoreValues.length) * 100,
      ) / 100;
      stats.max = Math.max(...scoreValues);
      stats.min = Math.min(...scoreValues);
      const passCount = scoreValues.filter((v) => v >= 60).length;
      stats.passRate = Math.round((passCount / scoreValues.length) * 10000) / 100;
    }

    return {
      doc: PDFDocument,
      courseName,
      className,
      semester: semester || '当前学期',
    };
  }

  /**
   * 获取PDF生成所需的原始数据
   */
  async getPDFRawData(courseId: number, classId?: number) {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    const courseName = course?.name || `课程${courseId}`;

    let enrollments = await this.enrollmentRepository.find({
      where: { courseId },
    });

    if (classId) {
      enrollments = enrollments.filter((e) => e.classId === Number(classId));
    }

    const studentIds = enrollments.map((e) => e.studentId);
    const className = enrollments[0]?.className || '全部班级';

    const scores = await this.totalScoreRepository.find({
      where: { courseId },
    });

    const scoreMap = new Map(scores.map((s) => [s.studentId, s]));

    const studentsData = [];
    for (const studentId of studentIds) {
      const student = await this.userRepository.findOneBy({ id: studentId });
      const score = scoreMap.get(studentId);

      if (student) {
        studentsData.push({
          studentNumber: student.id,
          studentName: student.name || '',
          experimentScore: score ? Number(score.experimentScore) : 0,
          examinationScore: score ? Number(score.examinationScore) : 0,
          totalScore: score ? Number(score.totalScore) : 0,
        });
      }
    }

    // 计算统计
    const scoreValues = scores.map((s) => Number(s.totalScore));
    const stats = {
      total: scoreValues.length,
      average: 0,
      max: 0,
      min: 0,
      passRate: 0,
    };

    if (scoreValues.length > 0) {
      stats.average = Math.round(
        (scoreValues.reduce((sum, v) => sum + v, 0) / scoreValues.length) * 100,
      ) / 100;
      stats.max = Math.max(...scoreValues);
      stats.min = Math.min(...scoreValues);
      const passCount = scoreValues.filter((v) => v >= 60).length;
      stats.passRate = Math.round((passCount / scoreValues.length) * 10000) / 100;
    }

    return {
      courseName,
      className,
      studentsData,
      stats,
    };
  }
}
