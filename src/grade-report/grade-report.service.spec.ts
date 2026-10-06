import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { GradeReportService } from './grade-report.service';
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
import { Course } from '../course/entities/course.entity';
import { EnrollmentService } from '../enrollment/enrollment.service';

describe('GradeReportService', () => {
  let service: GradeReportService;

  // Mock repositories
  let mockTotalScoreRepository: any;
  let mockTotalWeightRepository: any;
  let mockExperimentScoreRepository: any;
  let mockExperimentWeightRepository: any;
  let mockExaminationScoreRepository: any;
  let mockExaminationWeightRepository: any;
  let mockUserRepository: any;
  let mockExperimentRepository: any;
  let mockExaminationRepository: any;
  let mockEnrollmentRepository: any;
  let mockCourseRepository: any;
  let mockEnrollmentService: any;

  const mockStudent = {
    id: 1,
    name: '张三',
    studentNumber: '2023001',
  };

  const mockCourse = {
    id: 1,
    name: '软件工程',
  };

  const mockTotalScore = {
    id: 1,
    studentId: 1,
    courseId: 1,
    totalScore: 85,
    experimentScore: 80,
    examinationScore: 90,
  };

  const mockTotalWeight = {
    id: 1,
    courseId: 1,
    experimentWeight: 50,
    examinationWeight: 50,
  };

  const mockExperimentWeight = {
    id: 1,
    courseId: 1,
    experimentId: 1,
    weight: 50,
  };

  const mockExperiment = {
    id: 1,
    title: '实验一',
    courseId: 1,
  };

  const mockExperimentScore = {
    id: 1,
    courseId: 1,
    studentId: 1,
    experimentId: 1,
    score: 80,
  };

  const mockExaminationWeight = {
    id: 1,
    courseId: 1,
    examinationId: 1,
    weight: 50,
  };

  const mockExamination = {
    id: 1,
    title: '期中考试',
    courseId: 1,
  };

  const mockExaminationScore = {
    id: 1,
    courseId: 1,
    studentId: 1,
    examinationId: 1,
    score: 90,
  };

  const mockEnrollment = {
    id: 1,
    studentId: 1,
    courseId: 1,
    classId: 1,
    className: '软件工程1班',
  };

  beforeEach(async () => {
    mockTotalScoreRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockTotalWeightRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockExperimentScoreRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockExperimentWeightRepository = {
      find: jest.fn(),
    };

    mockExaminationScoreRepository = {
      find: jest.fn(),
    };

    mockExaminationWeightRepository = {
      find: jest.fn(),
    };

    mockUserRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockExperimentRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockExaminationRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockEnrollmentRepository = {
      find: jest.fn(),
    };

    mockCourseRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockEnrollmentService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradeReportService,
        { provide: getRepositoryToken(TotalScore), useValue: mockTotalScoreRepository },
        { provide: getRepositoryToken(TotalWeight), useValue: mockTotalWeightRepository },
        { provide: getRepositoryToken(ExperimentScore), useValue: mockExperimentScoreRepository },
        { provide: getRepositoryToken(ExperimentWeight), useValue: mockExperimentWeightRepository },
        { provide: getRepositoryToken(ExaminationScore), useValue: mockExaminationScoreRepository },
        { provide: getRepositoryToken(ExaminationWeight), useValue: mockExaminationWeightRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Experiment), useValue: mockExperimentRepository },
        { provide: getRepositoryToken(Examination), useValue: mockExaminationRepository },
        { provide: getRepositoryToken(Enrollment), useValue: mockEnrollmentRepository },
        { provide: getRepositoryToken(Course), useValue: mockCourseRepository },
        { provide: EnrollmentService, useValue: mockEnrollmentService },
      ],
    }).compile();

    service = module.get<GradeReportService>(GradeReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourseStatistics', () => {
    it('should return course statistics with valid data', async () => {
      const scores = [
        { totalScore: 85 },
        { totalScore: 90 },
        { totalScore: 75 },
        { totalScore: 60 },
        { totalScore: 55 },
      ];

      mockTotalScoreRepository.find.mockResolvedValue(scores);
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);

      const result = await service.getCourseStatistics(1) as any;

      expect(result.courseId).toBe(1);
      expect(result.courseName).toBe('软件工程');
      expect(result.averageScore).toBe(73);
      expect(result.maxScore).toBe(90);
      expect(result.minScore).toBe(55);
      expect(result.passRate).toBe(80);
      expect(result.excellentRate).toBe(20);
    });

    it('should return empty statistics when no scores', async () => {
      mockTotalScoreRepository.find.mockResolvedValue([]);
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);

      const result = await service.getCourseStatistics(1) as any;

      expect(result.courseId).toBe(1);
      expect(result.averageScore).toBe(0);
      expect(result.passRate).toBe(0);
      expect(result.excellentRate).toBe(0);
    });

    it('should calculate median correctly for odd number of scores', async () => {
      const scores = [
        { totalScore: 80 },
        { totalScore: 90 },
        { totalScore: 100 },
      ];

      mockTotalScoreRepository.find.mockResolvedValue(scores);
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);

      const result = await service.getCourseStatistics(1);

      expect(result.medianScore).toBe(90);
    });

    it('should calculate median correctly for even number of scores', async () => {
      const scores = [
        { totalScore: 80 },
        { totalScore: 90 },
        { totalScore: 100 },
        { totalScore: 110 },
      ];

      mockTotalScoreRepository.find.mockResolvedValue(scores);
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);

      const result = await service.getCourseStatistics(1);

      expect(result.medianScore).toBe(95);
    });
  });

  describe('getStudentGradeDetail', () => {
    it('should return student grade detail with all information', async () => {
      // Mock student
      mockUserRepository.findOneBy.mockResolvedValue(mockStudent);

      // Mock total score
      mockTotalScoreRepository.findOne.mockResolvedValue(mockTotalScore);

      // Mock weight
      mockTotalWeightRepository.findOneBy.mockResolvedValue(mockTotalWeight);

      // Mock experiment weights
      mockExperimentWeightRepository.find.mockResolvedValue([mockExperimentWeight]);

      // Mock experiment
      mockExperimentRepository.findOneBy.mockResolvedValue(mockExperiment);

      // Mock experiment score
      mockExperimentScoreRepository.findOne.mockResolvedValue(mockExperimentScore);

      // Mock examination weights
      mockExaminationWeightRepository.find.mockResolvedValue([mockExaminationWeight]);

      // Mock examination
      mockExaminationRepository.findOneBy.mockResolvedValue(mockExamination);

      // Mock examination scores
      mockExaminationScoreRepository.find.mockResolvedValue([mockExaminationScore]);

      const result = await service.getStudentGradeDetail(1, 1);

      expect(result.studentId).toBe(1);
      expect(result.studentName).toBe('张三');
      expect(result.studentNumber).toBe(1);
      expect(result.totalScore).toBe(85);
      expect(result.experimentTotal).toBe(80);
      expect(result.examinationTotal).toBe(90);
      expect(result.isPassing).toBe(true);
      expect(result.experimentDetails).toHaveLength(1);
      expect(result.examinationDetails).toHaveLength(1);
    });

    it('should throw NotFoundException when student not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getStudentGradeDetail(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should return zero scores when no data exists', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockStudent);
      mockTotalScoreRepository.findOne.mockResolvedValue(null);
      mockTotalWeightRepository.findOneBy.mockResolvedValue(null);
      mockExperimentWeightRepository.find.mockResolvedValue([]);
      mockExaminationWeightRepository.find.mockResolvedValue([]);

      const result = await service.getStudentGradeDetail(1, 1);

      expect(result.totalScore).toBe(0);
      expect(result.experimentTotal).toBe(0);
      expect(result.examinationTotal).toBe(0);
      expect(result.isPassing).toBe(false);
    });

    it('should handle multiple experiments correctly', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockStudent);
      mockTotalScoreRepository.findOne.mockResolvedValue(mockTotalScore);
      mockTotalWeightRepository.findOneBy.mockResolvedValue(mockTotalWeight);

      const experimentWeights = [
        { experimentId: 1, weight: 30 },
        { experimentId: 2, weight: 40 },
      ];
      mockExperimentWeightRepository.find.mockResolvedValue(experimentWeights);

      mockExperimentRepository.findOneBy.mockResolvedValue(mockExperiment);
      mockExperimentScoreRepository.findOne.mockResolvedValue(mockExperimentScore);

      const examinationWeights = [{ examinationId: 1, weight: 30 }];
      mockExaminationWeightRepository.find.mockResolvedValue(examinationWeights);
      mockExaminationRepository.findOneBy.mockResolvedValue(mockExamination);
      mockExaminationScoreRepository.find.mockResolvedValue([mockExaminationScore]);

      const result = await service.getStudentGradeDetail(1, 1);

      expect(result.experimentDetails).toHaveLength(2);
    });
  });

  describe('exportExcelData', () => {
    it('should export Excel data with students', async () => {
      // Mock course
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);

      // Mock enrollments
      mockEnrollmentRepository.find.mockResolvedValue([mockEnrollment]);

      // Mock scores
      mockTotalScoreRepository.find.mockResolvedValue([mockTotalScore]);

      // Mock student
      mockUserRepository.findOneBy.mockResolvedValue(mockStudent);

      const result = await service.exportExcelData(1);

      expect(result.workbook).toBeDefined();
      expect(result.courseName).toBe('软件工程');
      expect(result.className).toBe('软件工程1班');
    });

    it('should filter by class when classId provided', async () => {
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.find.mockResolvedValue([mockEnrollment]);
      mockTotalScoreRepository.find.mockResolvedValue([mockTotalScore]);
      mockUserRepository.findOneBy.mockResolvedValue(mockStudent);

      await service.exportExcelData(1, 1);

      expect(mockEnrollmentRepository.find).toHaveBeenCalled();
    });

    it('should handle empty enrollments', async () => {
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.find.mockResolvedValue([]);
      mockTotalScoreRepository.find.mockResolvedValue([]);

      const result = await service.exportExcelData(1);

      expect(result.workbook).toBeDefined();
      expect(result.className).toBe('全部班级');
    });

    it('should calculate statistics correctly', async () => {
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.find.mockResolvedValue([mockEnrollment]);
      mockTotalScoreRepository.find.mockResolvedValue([
        { totalScore: 80, experimentScore: 80, examinationScore: 80 },
        { totalScore: 60, experimentScore: 60, examinationScore: 60 },
      ]);
      mockUserRepository.findOneBy.mockResolvedValue(mockStudent);

      const result = await service.exportExcelData(1);

      expect(result.workbook).toBeDefined();
    });
  });

  describe('exportPDFData', () => {
    it('should export PDF data with statistics', async () => {
      // Mock course
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);

      // Mock enrollments
      mockEnrollmentRepository.find.mockResolvedValue([mockEnrollment]);

      // Mock scores
      mockTotalScoreRepository.find.mockResolvedValue([mockTotalScore]);

      const result = await service.exportPDFData(1);

      expect(result.doc).toBeDefined();
      expect(result.courseName).toBe('软件工程');
      expect(result.className).toBe('软件工程1班');
    });

    it('should handle empty scores', async () => {
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.find.mockResolvedValue([]);
      mockTotalScoreRepository.find.mockResolvedValue([]);

      const result = await service.exportPDFData(1);

      expect(result.doc).toBeDefined();
    });
  });

  describe('getPDFRawData', () => {
    it('should return PDF raw data with statistics', async () => {
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.find.mockResolvedValue([mockEnrollment]);
      mockTotalScoreRepository.find.mockResolvedValue([
        { totalScore: 90, experimentScore: 90, examinationScore: 90 },
        { totalScore: 80, experimentScore: 80, examinationScore: 80 },
        { totalScore: 70, experimentScore: 70, examinationScore: 70 },
        { totalScore: 60, experimentScore: 60, examinationScore: 60 },
        { totalScore: 50, experimentScore: 50, examinationScore: 50 },
      ]);
      mockUserRepository.findOneBy.mockResolvedValue(mockStudent);

      const result = await service.getPDFRawData(1);

      expect(result.courseName).toBe('软件工程');
      expect(result.className).toBe('软件工程1班');
      expect(result.stats.total).toBe(5);
      expect(result.stats.average).toBe(70);
      expect(result.stats.max).toBe(90);
      expect(result.stats.min).toBe(50);
      expect(result.stats.passRate).toBe(80);
    });

    it('should handle empty scores', async () => {
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.find.mockResolvedValue([]);
      mockTotalScoreRepository.find.mockResolvedValue([]);

      const result = await service.getPDFRawData(1);

      expect(result.stats.total).toBe(0);
      expect(result.stats.average).toBe(0);
      expect(result.stats.passRate).toBe(0);
    });
  });

  describe('getCourseStats', () => {
    it('should return course stats with distribution', async () => {
      const scores = [
        { totalScore: 55 },
        { totalScore: 65 },
        { totalScore: 75 },
        { totalScore: 85 },
        { totalScore: 95 },
      ];

      mockTotalScoreRepository.find.mockResolvedValue(scores);

      const result = await service.getCourseStats(1);

      expect(result.courseId).toBe(1);
      expect(result.totalStudents).toBe(5);
      expect(result.averageScore).toBe(75);
      expect(result.passRate).toBe(80);
      expect(result.maxScore).toBe(95);
      expect(result.minScore).toBe(55);
      expect(result.distribution).toHaveLength(5);
      expect(result.distribution[0].count).toBe(1); // 0-59
      expect(result.distribution[1].count).toBe(1); // 60-69
      expect(result.distribution[2].count).toBe(1); // 70-79
      expect(result.distribution[3].count).toBe(1); // 80-89
      expect(result.distribution[4].count).toBe(1); // 90-100
    });

    it('should return empty stats when no scores', async () => {
      mockTotalScoreRepository.find.mockResolvedValue([]);

      const result = await service.getCourseStats(1);

      expect(result.totalStudents).toBe(0);
      expect(result.averageScore).toBe(0);
      expect(result.passRate).toBe(0);
      expect(result.maxScore).toBe(0);
      expect(result.minScore).toBe(0);
    });
  });

  describe('exportCourseGrades', () => {
    it('should export course grades as CSV data', async () => {
      mockTotalScoreRepository.find.mockResolvedValue([mockTotalScore]);
      mockUserRepository.findOneBy.mockResolvedValue(mockStudent);

      const result = await service.exportCourseGrades(1);

      expect(result).toHaveLength(1);
      expect(result[0].studentNumber).toBe(1);
      expect(result[0].studentName).toBe('张三');
      expect(result[0].totalScore).toBe(85);
      expect(result[0].isPassing).toBe(true);
    });

    it('should return empty array when no scores', async () => {
      mockTotalScoreRepository.find.mockResolvedValue([]);

      const result = await service.exportCourseGrades(1);

      expect(result).toHaveLength(0);
    });

    it('should sort by student number', async () => {
      mockTotalScoreRepository.find.mockResolvedValue([
        { studentId: 2, totalScore: 80, experimentScore: 80, examinationScore: 80 },
        { studentId: 1, totalScore: 90, experimentScore: 90, examinationScore: 90 },
      ]);
      mockUserRepository.findOneBy
        .mockResolvedValueOnce({ id: 2, name: '李四' })
        .mockResolvedValueOnce({ id: 1, name: '张三' });

      const result = await service.exportCourseGrades(1);

      expect(result[0].studentNumber).toBe(1);
      expect(result[1].studentNumber).toBe(2);
    });
  });

  describe('getGradeDistribution', () => {
    it('should return grade distribution', async () => {
      const scores = [
        { totalScore: 55 },
        { totalScore: 65 },
        { totalScore: 75 },
        { totalScore: 85 },
        { totalScore: 95 },
      ];

      mockTotalScoreRepository.find.mockResolvedValue(scores);
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);

      const result = await service.getGradeDistribution(1);

      expect(result.courseId).toBe(1);
      expect(result.distribution).toHaveLength(5);
      expect(result.distribution[0].range).toBe('0-60');
      expect(result.distribution[0].count).toBe(1);
      expect(result.distribution[0].percentage).toBe(20);
    });
  });

  describe('getGradeComparison', () => {
    it('should return grade comparison between two semesters', async () => {
      const scores = [
        { totalScore: 90 },
        { totalScore: 80 },
        { totalScore: 70 },
        { totalScore: 60 },
        { totalScore: 50 },
        { totalScore: 85 },
      ];

      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);
      mockTotalScoreRepository.find.mockResolvedValue(scores);

      const result = await service.getGradeComparison(1, '2023-1', '2023-2');

      expect(result.courseId).toBe(1);
      expect(result.semester1).toBe('2023-1');
      expect(result.semester2).toBe('2023-2');
      expect(result.semester1Stats.totalStudents).toBe(3);
      expect(result.semester2Stats.totalStudents).toBe(3);
    });

    it('should return empty stats when no scores', async () => {
      mockCourseRepository.findOneBy.mockResolvedValue(mockCourse);
      mockTotalScoreRepository.find.mockResolvedValue([]);

      const result = await service.getGradeComparison(1, '2023-1', '2023-2');

      expect(result.semester1Stats.totalStudents).toBe(0);
      expect(result.semester2Stats.totalStudents).toBe(0);
    });
  });

  describe('getStudentStatistics', () => {
    it('should return student statistics', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockStudent);

      const scores = [
        { courseId: 1, totalScore: 85 },
        { courseId: 2, totalScore: 90 },
      ];
      mockTotalScoreRepository.find.mockResolvedValue(scores);

      mockCourseRepository.findOneBy
        .mockResolvedValueOnce({ id: 1, name: '课程1' })
        .mockResolvedValueOnce({ id: 2, name: '课程2' });

      const enrollments = [{ studentId: 1, classId: 1 }];
      mockEnrollmentRepository.find.mockResolvedValue(enrollments);
      mockEnrollmentRepository.find.mockResolvedValue([{ studentId: 1, classId: 1 }]);
      mockTotalScoreRepository.findOne.mockResolvedValue({ totalScore: 80 });

      const result = await service.getStudentStatistics(1);

      expect(result.studentId).toBe(1);
      expect(result.studentName).toBe('张三');
      expect(result.courses).toHaveLength(2);
      expect(result.semesterAverage).toBe(87.5);
    });

    it('should throw NotFoundException when student not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getStudentStatistics(999)).rejects.toThrow(NotFoundException);
    });
  });
});
