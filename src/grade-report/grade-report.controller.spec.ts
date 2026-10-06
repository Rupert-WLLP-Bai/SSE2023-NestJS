import { Test, TestingModule } from '@nestjs/testing';
import { GradeReportController } from './grade-report.controller';
import { GradeReportService } from './grade-report.service';

describe('GradeReportController', () => {
  let controller: GradeReportController;
  let mockService: any;

  const mockCourseStats = {
    courseId: 1,
    totalStudents: 30,
    averageScore: 75.5,
    passRate: 80,
    maxScore: 95,
    minScore: 50,
    distribution: [
      { range: '0-59', count: 3, percentage: 10 },
      { range: '60-69', count: 6, percentage: 20 },
      { range: '70-79', count: 9, percentage: 30 },
      { range: '80-89', count: 8, percentage: 26.67 },
      { range: '90-100', count: 4, percentage: 13.33 },
    ],
  };

  const mockStudentGradeDetail = {
    studentId: 1,
    studentName: '张三',
    studentNumber: 1,
    experimentDetails: [
      {
        experimentId: 1,
        experimentName: '实验一',
        score: 80,
        weight: 50,
        weightedScore: 40,
      },
    ],
    examinationDetails: [
      {
        examinationId: 1,
        examinationName: '期中考试',
        score: 90,
        weight: 50,
        weightedScore: 45,
      },
    ],
    weightInfo: {
      experimentWeight: 50,
      examinationWeight: 50,
    },
    totalScore: 85,
    experimentTotal: 40,
    examinationTotal: 45,
    isPassing: true,
  };

  const mockCourseStatistics = {
    courseId: 1,
    courseName: '软件工程',
    maxScore: 95,
    minScore: 50,
    averageScore: 75.5,
    medianScore: 78,
    passRate: 80,
    excellentRate: 20,
  };

  const mockGradeDistribution = {
    courseId: 1,
    courseName: '软件工程',
    distribution: [
      { range: '0-60', count: 3, percentage: 10 },
      { range: '60-70', count: 6, percentage: 20 },
      { range: '70-80', count: 9, percentage: 30 },
      { range: '80-90', count: 8, percentage: 26.67 },
      { range: '90-100', count: 4, percentage: 13.33 },
    ],
  };

  const mockGradeComparison = {
    courseId: 1,
    courseName: '软件工程',
    semester1: '2023-1',
    semester2: '2023-2',
    semester1Stats: {
      totalStudents: 30,
      averageScore: 72,
      passRate: 76.67,
      excellentRate: 16.67,
    },
    semester2Stats: {
      totalStudents: 30,
      averageScore: 75.5,
      passRate: 80,
      excellentRate: 20,
    },
  };

  const mockStudentStatistics = {
    studentId: 1,
    studentName: '张三',
    studentNumber: 1,
    courses: [
      { courseId: 1, courseName: '软件工程', totalScore: 85 },
      { courseId: 2, courseName: '数据结构', totalScore: 90 },
    ],
    semesterAverage: 87.5,
    classRank: 5,
  };

  const createMockResponse = () => {
    const res: any = {};
    res.setHeader = jest.fn().mockReturnValue(res);
    res.write = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
    res.links = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.jsonp = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    res.locals = {};
    res.headersSent = false;
    res.app = {};
    res.removeHeader = jest.fn();
    res.getHeader = jest.fn();
    res.getHeaders = jest.fn();
    res.hasHeader = jest.fn();
    res.append = jest.fn();
    res.vary = jest.fn();
    res.type = jest.fn();
    res.format = jest.fn();
    res.attachment = jest.fn();
    res.download = jest.fn();
    res.sendFile = jest.fn();
    res.sendFile = jest.fn();
    res.pipeline = jest.fn();
    res.pipe = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    mockService = {
      getCourseStats: jest.fn(),
      getStudentGradeDetail: jest.fn(),
      exportCourseGrades: jest.fn(),
      getCourseStatistics: jest.fn(),
      getStudentStatistics: jest.fn(),
      getGradeDistribution: jest.fn(),
      getGradeComparison: jest.fn(),
      exportExcelData: jest.fn(),
      getPDFRawData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradeReportController],
      providers: [
        {
          provide: GradeReportService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<GradeReportController>(GradeReportController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourseStats', () => {
    it('should return course statistics', async () => {
      mockService.getCourseStats.mockResolvedValue(mockCourseStats);

      const result = (await controller.getCourseStats(1)) as any;

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCourseStats);
      expect(mockService.getCourseStats).toHaveBeenCalledWith(1);
    });

    it('should handle error when getting course stats fails', async () => {
      mockService.getCourseStats.mockRejectedValue(new Error('Database error'));

      const result = (await controller.getCourseStats(1)) as any;

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Database error');
    });
  });

  describe('getStudentGradeDetail', () => {
    it('should return student grade detail', async () => {
      mockService.getStudentGradeDetail.mockResolvedValue(
        mockStudentGradeDetail,
      );

      const result = (await controller.getStudentGradeDetail(1, 1)) as any;

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStudentGradeDetail);
      expect(mockService.getStudentGradeDetail).toHaveBeenCalledWith(1, 1);
    });

    it('should handle error when student not found', async () => {
      mockService.getStudentGradeDetail.mockRejectedValue(
        new Error('学生 1 不存在'),
      );

      const result = (await controller.getStudentGradeDetail(999, 1)) as any;

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('学生 1 不存在');
    });
  });

  describe('exportCourseGrades', () => {
    it('should export course grades as CSV', async () => {
      const mockData = [
        {
          studentNumber: 1,
          studentName: '张三',
          experimentTotal: 80,
          examinationTotal: 90,
          totalScore: 85,
          isPassing: true,
        },
      ];
      mockService.exportCourseGrades.mockResolvedValue(mockData);

      const mockResponse = createMockResponse();

      await controller.exportCourseGrades(1, mockResponse as any);

      expect(mockService.exportCourseGrades).toHaveBeenCalledWith(1);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/csv; charset=utf-8',
      );
    });

    it('should handle error during CSV export', async () => {
      mockService.exportCourseGrades.mockRejectedValue(
        new Error('Export failed'),
      );

      const mockResponse = createMockResponse();

      await controller.exportCourseGrades(1, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errorMessage: 'Export failed',
      });
    });
  });

  describe('getCourseStatistics', () => {
    it('should return course statistics', async () => {
      mockService.getCourseStatistics.mockResolvedValue(mockCourseStatistics);

      const result = (await controller.getCourseStatistics(1)) as any;

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCourseStatistics);
      expect(mockService.getCourseStatistics).toHaveBeenCalledWith(1);
    });

    it('should handle error', async () => {
      mockService.getCourseStatistics.mockRejectedValue(new Error('Error'));

      const result = (await controller.getCourseStatistics(1)) as any;

      expect(result.success).toBe(false);
    });
  });

  describe('getStudentStatistics', () => {
    it('should return student statistics', async () => {
      mockService.getStudentStatistics.mockResolvedValue(mockStudentStatistics);

      const result = (await controller.getStudentStatistics(1)) as any;

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStudentStatistics);
      expect(mockService.getStudentStatistics).toHaveBeenCalledWith(1);
    });

    it('should handle error when student not found', async () => {
      mockService.getStudentStatistics.mockRejectedValue(
        new Error('学生不存在'),
      );

      const result = (await controller.getStudentStatistics(999)) as any;

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('学生不存在');
    });
  });

  describe('getGradeDistribution', () => {
    it('should return grade distribution', async () => {
      mockService.getGradeDistribution.mockResolvedValue(mockGradeDistribution);

      const result = (await controller.getGradeDistribution(1)) as any;

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGradeDistribution);
      expect(mockService.getGradeDistribution).toHaveBeenCalledWith(1);
    });
  });

  describe('getGradeComparison', () => {
    it('should return grade comparison', async () => {
      mockService.getGradeComparison.mockResolvedValue(mockGradeComparison);

      const result = (await controller.getGradeComparison(
        '1',
        '2023-1',
        '2023-2',
      )) as any;

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGradeComparison);
      expect(mockService.getGradeComparison).toHaveBeenCalledWith(
        1,
        '2023-1',
        '2023-2',
      );
    });

    it('should return error when courseId not provided', async () => {
      const result = (await controller.getGradeComparison(
        undefined,
        '2023-1',
        '2023-2',
      )) as any;

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('请提供课程ID');
    });
  });

  describe('exportExcel', () => {
    it('should export Excel file', async () => {
      const mockWorkbook = {
        xlsx: {
          write: jest.fn().mockResolvedValue(undefined),
        },
      };
      mockService.exportExcelData.mockResolvedValue({
        workbook: mockWorkbook,
        courseName: '软件工程',
        className: '软件工程1班',
        semester: '2023-1',
      });

      const mockResponse = createMockResponse();

      await controller.exportExcel(
        { courseId: '1', classId: '1', semester: '2023-1' },
        mockResponse as any,
      );

      expect(mockService.exportExcelData).toHaveBeenCalledWith(1, 1, '2023-1');
    });

    it('should return error when courseId not provided', async () => {
      const mockResponse = createMockResponse();

      await controller.exportExcel(
        { courseId: undefined },
        mockResponse as any,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errorMessage: '请提供课程ID',
      });
    });

    it('should handle error during Excel export', async () => {
      mockService.exportExcelData.mockRejectedValue(new Error('Export failed'));

      const mockResponse = createMockResponse();

      await controller.exportExcel({ courseId: '1' }, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errorMessage: 'Export failed',
      });
    });
  });

  describe('exportPDF', () => {
    it('should export PDF file', async () => {
      mockService.getPDFRawData.mockResolvedValue({
        courseName: '软件工程',
        className: '软件工程1班',
        studentsData: [
          {
            studentNumber: 1,
            studentName: '张三',
            experimentScore: 80,
            examinationScore: 90,
            totalScore: 85,
          },
        ],
        stats: {
          total: 1,
          average: 85,
          max: 85,
          min: 85,
          passRate: 100,
        },
      });

      const mockResponse = createMockResponse();

      await controller.exportPDF(
        { courseId: '1', classId: '1', semester: '2023-1' },
        mockResponse as any,
      );

      expect(mockService.getPDFRawData).toHaveBeenCalledWith(1, 1);
    });

    it('should return error when courseId not provided', async () => {
      const mockResponse = createMockResponse();

      await controller.exportPDF({ courseId: undefined }, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errorMessage: '请提供课程ID',
      });
    });

    it('should handle error during PDF export', async () => {
      mockService.getPDFRawData.mockRejectedValue(new Error('Export failed'));

      const mockResponse = createMockResponse();

      await controller.exportPDF({ courseId: '1' }, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errorMessage: 'Export failed',
      });
    });
  });
});
