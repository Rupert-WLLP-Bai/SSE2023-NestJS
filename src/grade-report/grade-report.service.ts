import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TotalScore } from '../total_score/entities/total_score.entity';
import { TotalWeight } from '../total_weight/entities/total_weight.entity';
import { ExperimentScore } from '../experiment_score/entities/experiment_score.entity';
import { ExperimentWeight } from '../experiment_weight/entities/experiment_weight.entity';
import { ExaminationScore } from '../examination_score/entities/examination_score.entity';
import { ExaminationWeight } from '../examination_weight/entities/examination_weight.entity';
import { User } from '../user/entities/user.entity';
import { Experiment } from '../experiment/entities/experiment.entity';
import { Examination } from '../examination/entities/examination.entity';
import { EnrollmentService } from '../enrollment/enrollment.service';

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
    private readonly enrollmentService: EnrollmentService,
  ) {}

  /**
   * 获取课程成绩统计
   */
  async getCourseStats(courseId: number): Promise<CourseStats> {
    // 获取课程所有学生的总分
    const scores = await this.totalScoreRepository.find({ where: { courseId } });

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
    const scores = await this.totalScoreRepository.find({ where: { courseId } });

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
}
