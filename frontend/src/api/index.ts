import request from './request'

// 登录相关API
export const loginApi = {
  account: (data: { username: string; password: string }) =>
    request.post('/login/account', data),
  outlogin: () => request.get('/login/outlogin'),
}

// 用户相关API
export const userApi = {
  create: (data: any) => request.post('/user', data),
  list: (params?: any) => request.get('/user', { params }),
  get: (id: string) => request.get(`/user/${id}`),
  update: (id: string, data: any) => request.patch(`/user/${id}`, data),
  delete: (id: string) => request.delete(`/user/${id}`),
  query: (data: any) => request.post('/user/query', data),
}

// 课程相关API
export const courseApi = {
  create: (data: any) => request.post('/course', data),
  list: (params?: any) => request.get('/course', { params }),
  get: (id: string) => request.get(`/course/${id}`),
  update: (id: string, data: any) => request.patch(`/course/${id}`, data),
  delete: (id: string) => request.delete(`/course/${id}`),
  query: (data: any) => request.post('/course/query', data),
}

// 班级相关API
export const classApi = {
  create: (data: any) => request.post('/class', data),
  list: (params?: any) => request.get('/class', { params }),
  get: (id: string) => request.get(`/class/${id}`),
  update: (id: string, data: any) => request.patch(`/class/${id}`, data),
  delete: (id: string) => request.delete(`/class/${id}`),
  query: (data: any) => request.post('/class/query', data),
  getByCourse: (courseId: string) => request.get(`/class/course/${courseId}`),
  getByTeacher: (teacherId: string) => request.get(`/class/teacher/${teacherId}`),
}

// 选课相关API
export const enrollmentApi = {
  create: (data: any) => request.post('/enrollment', data),
  list: (params?: any) => request.get('/enrollment', { params }),
  get: (id: string) => request.get(`/enrollment/${id}`),
  update: (id: string, data: any) => request.patch(`/enrollment/${id}`, data),
  delete: (id: string) => request.delete(`/enrollment/${id}`),
  query: (data: any) => request.post('/enrollment/query', data),
  getByStudent: (studentId: string) => request.get(`/enrollment/student/${studentId}`),
  getByClass: (classId: string) => request.get(`/enrollment/class/${classId}`),
  getByCourse: (courseId: string) => request.get(`/enrollment/course/${courseId}`),
  drop: (studentId: string, classId: string) =>
    request.post(`/enrollment/student/${studentId}/class/${classId}/drop`),
}

// 公告相关API
export const noticeApi = {
  create: (data: any) => request.post('/notice', data),
  list: (params?: any) => request.get('/notice', { params }),
  get: (id: string) => request.get(`/notice/${id}`),
  update: (id: string, data: any) => request.patch(`/notice/${id}`, data),
  delete: (id: string) => request.delete(`/notice/${id}`),
  query: (data: any) => request.post('/notice/query', data),
}

// 文件相关API
export const fileApi = {
  upload: (data: FormData) => request.post('/file/qiniu', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  list: (params?: any) => request.get('/file/qiniu', { params }),
  download: (filepath: string) => request.get(`/file/qiniu/${filepath}`, {
    responseType: 'blob'
  }),
}

// 实验相关API
export const experimentApi = {
  create: (data: any) => request.post('/experiment', data),
  list: (params?: any) => request.get('/experiment', { params }),
  get: (id: string) => request.get(`/experiment/${id}`),
  update: (id: string, data: any) => request.patch(`/experiment/${id}`, data),
  delete: (id: string) => request.delete(`/experiment/${id}`),
  query: (data: any) => request.post('/experiment/query', data),
}

// 实验提交相关API
export const experimentSubmitApi = {
  create: (data: any) => request.post('/experiment-submit', data),
  list: (params?: any) => request.get('/experiment-submit', { params }),
  get: (id: string) => request.get(`/experiment-submit/${id}`),
  delete: (id: string) => request.delete(`/experiment-submit/${id}`),
}

// 实验成绩相关API
export const experimentScoreApi = {
  create: (data: any) => request.post('/experiment-score', data),
  list: (params?: any) => request.get('/experiment-score', { params }),
  get: (id: string) => request.get(`/experiment-score/${id}`),
  update: (id: string, data: any) => request.patch(`/experiment-score/${id}`, data),
  delete: (id: string) => request.delete(`/experiment-score/${id}`),
  query: (data: any) => request.post('/experiment-score/query', data),
  upsert: (data: any) => request.post('/experiment-score/upsert', data),
}

// 实验权重相关API
export const experimentWeightApi = {
  create: (data: any) => request.post('/experiment-weight', data),
  list: (params?: any) => request.get('/experiment-weight', { params }),
  get: (id: string) => request.get(`/experiment-weight/${id}`),
  update: (id: string, data: any) => request.patch(`/experiment-weight/${id}`, data),
  delete: (id: string) => request.delete(`/experiment-weight/${id}`),
  query: (data: any) => request.post('/experiment-weight/query', data),
}

// 考试相关API
export const examinationApi = {
  create: (data: any) => request.post('/examination', data),
  list: (params?: any) => request.get('/examination', { params }),
  get: (id: string) => request.get(`/examination/${id}`),
  update: (id: string, data: any) => request.patch(`/examination/${id}`, data),
  delete: (id: string) => request.delete(`/examination/${id}`),
  query: (data: any) => request.post('/examination/query', data),
  start: (id: string) => request.post(`/examination/${id}/start`),
  end: (id: string) => request.post(`/examination/${id}/end`),
  archive: (id: string) => request.post(`/examination/${id}/archive`),
}

// 考试提交相关API
export const examinationSubmitApi = {
  create: (data: any) => request.post('/examination-submit', data),
  list: (params?: any) => request.get('/examination-submit', { params }),
  get: (id: string) => request.get(`/examination-submit/${id}`),
  update: (id: string, data: any) => request.patch(`/examination-submit/${id}`, data),
  delete: (id: string) => request.delete(`/examination-submit/${id}`),
  query: (data: any) => request.post('/examination-submit/query', data),
  markGraded: (examinationId: string, studentId: string, problemId: string) =>
    request.post(`/examination-submit/${examinationId}/student/${studentId}/problem/${problemId}/mark-graded`),
}

// 考试成绩相关API
export const examinationScoreApi = {
  create: (data: any) => request.post('/examination-score', data),
  list: (params?: any) => request.get('/examination-score', { params }),
  get: (id: string) => request.get(`/examination-score/${id}`),
  update: (id: string, data: any) => request.patch(`/examination-score/${id}`, data),
  delete: (id: string) => request.delete(`/examination-score/${id}`),
  query: (data: any) => request.post('/examination-score/query', data),
  upsert: (data: any) => request.post('/examination-score/upsert', data),
}

// 考试权重相关API
export const examinationWeightApi = {
  create: (data: any) => request.post('/examination-weight', data),
  list: (params?: any) => request.get('/examination-weight', { params }),
  get: (id: string) => request.get(`/examination-weight/${id}`),
  update: (id: string, data: any) => request.patch(`/examination-weight/${id}`, data),
  delete: (id: string) => request.delete(`/examination-weight/${id}`),
  query: (data: any) => request.post('/examination-weight/query', data),
}

// 考试题目相关API
export const examinationProblemListApi = {
  create: (data: any) => request.post('/examination-problem-list', data),
  list: (params?: any) => request.get('/examination-problem-list', { params }),
  get: (id: string) => request.get(`/examination-problem-list/${id}`),
  update: (id: string, data: any) => request.patch(`/examination-problem-list/${id}`, data),
  delete: (id: string) => request.delete(`/examination-problem-list/${id}`),
  getByExamination: (examinationId: string) =>
    request.get(`/examination-problem-list/examination/${examinationId}`),
}

// 考试学生相关API
export const examinationStudentListApi = {
  create: (data: any) => request.post('/examination-student-list', data),
  list: (params?: any) => request.get('/examination-student-list', { params }),
  get: (id: string) => request.get(`/examination-student-list/${id}`),
  update: (id: string, data: any) => request.patch(`/examination-student-list/${id}`, data),
  delete: (id: string) => request.delete(`/examination-student-list/${id}`),
  getByExamination: (examinationId: string) =>
    request.get(`/examination-student-list/examination/${examinationId}`),
  getByStudent: (studentId: string) =>
    request.get(`/examination-student-list/student/${studentId}`),
  importClass: (examinationId: string, classId: string) =>
    request.post(`/examination-student-list/examination/${examinationId}/import-class/${classId}`),
}

// 总成绩相关API
export const totalScoreApi = {
  create: (data: any) => request.post('/total-score', data),
  list: (params?: any) => request.get('/total-score', { params }),
  get: (id: string) => request.get(`/total-score/${id}`),
  update: (id: string, data: any) => request.patch(`/total-score/${id}`, data),
  delete: (id: string) => request.delete(`/total-score/${id}`),
  query: (data: any) => request.post('/total-score/query', data),
  recalculate: (courseId: string) => request.post(`/total-score/course/${courseId}/recalculate`),
  getByCourse: (courseId: string) => request.get(`/total-score/course/${courseId}`),
}

// 总权重相关API
export const totalWeightApi = {
  create: (data: any) => request.post('/total-weight', data),
  list: (params?: any) => request.get('/total-weight', { params }),
  get: (id: string) => request.get(`/total-weight/${id}`),
  update: (id: string, data: any) => request.patch(`/total-weight/${id}`, data),
  delete: (id: string) => request.delete(`/total-weight/${id}`),
  getByCourse: (courseId: string) => request.get(`/total-weight/course/${courseId}`),
}

// 成绩报表相关API
export const gradeReportApi = {
  getCourseStats: (courseId: string) => request.get(`/grade-report/course/${courseId}/stats`),
  getStudentReport: (studentId: string, courseId: string) =>
    request.get(`/grade-report/student/${studentId}/course/${courseId}`),
  exportCsv: (courseId: string, params?: any) =>
    request.get(`/grade-report/course/${courseId}/export`, {
      params,
      responseType: 'blob'
    }),
  exportExcel: (params?: any) => request.get('/grade-report/export/excel', {
    params,
    responseType: 'blob'
  }),
  exportPdf: (params?: any) => request.get('/grade-report/export/pdf', {
    params,
    responseType: 'blob'
  }),
  getCourseStatistics: (courseId: string) =>
    request.get(`/grade-report/statistics/course/${courseId}`),
  getStudentStatistics: (studentId: string) =>
    request.get(`/grade-report/statistics/student/${studentId}`),
  getDistribution: (courseId: string) =>
    request.get(`/grade-report/distribution/course/${courseId}`),
  compare: (params: any) => request.get('/grade-report/compare', { params }),
}

// 审计日志相关API
export const auditApi = {
  list: (params?: any) => request.get('/audit', { params }),
}

// 通用API
export const commonApi = {
  getCurrentUser: () => request.get('/currentUser'),
  health: () => request.get('/health'),
}
