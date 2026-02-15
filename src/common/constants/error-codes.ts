/**
 * @file 统一错误码定义
 * @description 定义系统中所有业务错误码，格式: ERR_{MODULE}_{CODE}
 * @author SSE Team
 */

/**
 * 通用错误码
 */
export const CommonErrorCode = {
  // 通用错误 (1xxx)
  INTERNAL_ERROR: 'ERR_COMMON_INTERNAL_ERROR',
  INVALID_PARAMETER: 'ERR_COMMON_INVALID_PARAMETER',
  NOT_FOUND: 'ERR_COMMON_NOT_FOUND',
  UNAUTHORIZED: 'ERR_COMMON_UNAUTHORIZED',
  FORBIDDEN: 'ERR_COMMON_FORBIDDEN',
  CONFLICT: 'ERR_COMMON_CONFLICT',
  SERVICE_UNAVAILABLE: 'ERR_COMMON_SERVICE_UNAVAILABLE',
  METHOD_NOT_ALLOWED: 'ERR_COMMON_METHOD_NOT_ALLOWED',
  VALIDATION_ERROR: 'ERR_COMMON_VALIDATION_ERROR',

  // 认证授权错误 (2xxx)
  INVALID_TOKEN: 'ERR_AUTH_INVALID_TOKEN',
  TOKEN_EXPIRED: 'ERR_AUTH_TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'ERR_AUTH_INVALID_CREDENTIALS',
  ACCOUNT_DISABLED: 'ERR_AUTH_ACCOUNT_DISABLED',
  ACCOUNT_LOCKED: 'ERR_AUTH_ACCOUNT_LOCKED',
  INSUFFICIENT_PERMISSIONS: 'ERR_AUTH_INSUFFICIENT_PERMISSIONS',
  ROLE_FORBIDDEN: 'ERR_AUTH_ROLE_FORBIDDEN',
} as const;

/**
 * 用户模块错误码
 */
export const UserErrorCode = {
  USER_NOT_FOUND: 'ERR_USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'ERR_USER_ALREADY_EXISTS',
  INVALID_PASSWORD: 'ERR_USER_INVALID_PASSWORD',
  WEAK_PASSWORD: 'ERR_USER_WEAK_PASSWORD',
  EMAIL_ALREADY_EXISTS: 'ERR_USER_EMAIL_ALREADY_EXISTS',
  PHONE_ALREADY_EXISTS: 'ERR_USER_PHONE_ALREADY_EXISTS',
  INVALID_EMAIL_FORMAT: 'ERR_USER_INVALID_EMAIL_FORMAT',
  INVALID_PHONE_FORMAT: 'ERR_USER_INVALID_PHONE_FORMAT',
  USER_DISABLED: 'ERR_USER_DISABLED',
} as const;

/**
 * 课程模块错误码
 */
export const CourseErrorCode = {
  COURSE_NOT_FOUND: 'ERR_COURSE_NOT_FOUND',
  COURSE_ALREADY_EXISTS: 'ERR_COURSE_ALREADY_EXISTS',
  COURSE_CODE_DUPLICATE: 'ERR_COURSE_CODE_DUPLICATE',
  INVALID_CREDIT: 'ERR_COURSE_INVALID_CREDIT',
  COURSE_FULL: 'ERR_COURSE_FULL',
  COURSE_NOT_STARTED: 'ERR_COURSE_NOT_STARTED',
  COURSE_ENDED: 'ERR_COURSE_ENDED',
} as const;

/**
 * 班级模块错误码
 */
export const ClassErrorCode = {
  CLASS_NOT_FOUND: 'ERR_CLASS_NOT_FOUND',
  CLASS_ALREADY_EXISTS: 'ERR_CLASS_ALREADY_EXISTS',
  CLASS_CODE_DUPLICATE: 'ERR_CLASS_CODE_DUPLICATE',
  CLASS_FULL: 'ERR_CLASS_FULL',
  CLASS_ENDED: 'ERR_CLASS_ENDED',
} as const;

/**
 * 实验模块错误码
 */
export const ExperimentErrorCode = {
  EXPERIMENT_NOT_FOUND: 'ERR_EXPERIMENT_NOT_FOUND',
  EXPERIMENT_NOT_STARTED: 'ERR_EXPERIMENT_NOT_STARTED',
  EXPERIMENT_ENDED: 'ERR_EXPERIMENT_ENDED',
  EXPERIMENT_CLOSED: 'ERR_EXPERIMENT_CLOSED',
  SUBMIT_TOO_LATE: 'ERR_EXPERIMENT_SUBMIT_TOO_LATE',
  SUBMIT_TOO_EARLY: 'ERR_EXPERIMENT_SUBMIT_TOO_EARLY',
  ALREADY_SUBMITTED: 'ERR_EXPERIMENT_ALREADY_SUBMITTED',
} as const;

/**
 * 考试模块错误码
 */
export const ExaminationErrorCode = {
  EXAMINATION_NOT_FOUND: 'ERR_EXAMINATION_NOT_FOUND',
  EXAMINATION_NOT_STARTED: 'ERR_EXAMINATION_NOT_STARTED',
  EXAMINATION_ENDED: 'ERR_EXAMINATION_ENDED',
  EXAMINATION_CLOSED: 'ERR_EXAMINATION_CLOSED',
  EXAMINATION_NOT_PARTICIPANT: 'ERR_EXAMINATION_NOT_PARTICIPANT',
  ALREADY_SUBMITTED: 'ERR_EXAMINATION_ALREADY_SUBMITTED',
  SUBMIT_TOO_LATE: 'ERR_EXAMINATION_SUBMIT_TOO_LATE',
} as const;

/**
 * 成绩模块错误码
 */
export const ScoreErrorCode = {
  SCORE_NOT_FOUND: 'ERR_SCORE_NOT_FOUND',
  INVALID_SCORE: 'ERR_SCORE_INVALID_SCORE',
  SCORE_ALREADY_EXISTS: 'ERR_SCORE_ALREADY_EXISTS',
  SCORE_NOT_PUBLISHED: 'ERR_SCORE_NOT_PUBLISHED',
  WEIGHT_NOT_CONFIGURED: 'ERR_SCORE_WEIGHT_NOT_CONFIGURED',
  WEIGHT_INVALID: 'ERR_SCORE_WEIGHT_INVALID',
  WEIGHT_SUM_EXCEED: 'ERR_SCORE_WEIGHT_SUM_EXCEED',
} as const;

/**
 * 选课模块错误码
 */
export const EnrollmentErrorCode = {
  ENROLLMENT_NOT_FOUND: 'ERR_ENROLLMENT_NOT_FOUND',
  ALREADY_ENROLLED: 'ERR_ENROLLMENT_ALREADY_ENROLLED',
  NOT_ENROLLED: 'ERR_ENROLLMENT_NOT_ENROLLED',
  ENROLLMENT_CLOSED: 'ERR_ENROLLMENT_CLOSED',
  ENROLLMENT_NOT_STARTED: 'ERR_ENROLLMENT_NOT_STARTED',
} as const;

/**
 * 文件模块错误码
 */
export const FileErrorCode = {
  FILE_NOT_FOUND: 'ERR_FILE_NOT_FOUND',
  FILE_TOO_LARGE: 'ERR_FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED: 'ERR_FILE_TYPE_NOT_ALLOWED',
  FILE_UPLOAD_FAILED: 'ERR_FILE_UPLOAD_FAILED',
  FILE_DOWNLOAD_FAILED: 'ERR_FILE_DOWNLOAD_FAILED',
} as const;

/**
 * 导出所有错误码
 */
export const ErrorCodes = {
  ...CommonErrorCode,
  ...UserErrorCode,
  ...CourseErrorCode,
  ...ClassErrorCode,
  ...ExperimentErrorCode,
  ...ExaminationErrorCode,
  ...ScoreErrorCode,
  ...EnrollmentErrorCode,
  ...FileErrorCode,
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * 错误消息映射
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ErrorMessages: Record<string, any> = {
  // 通用错误
  [CommonErrorCode.INTERNAL_ERROR]: '服务器内部错误',
  [CommonErrorCode.INVALID_PARAMETER]: '请求参数无效',
  [CommonErrorCode.NOT_FOUND]: '资源不存在',
  [CommonErrorCode.UNAUTHORIZED]: '未授权，请先登录',
  [CommonErrorCode.FORBIDDEN]: '无权访问',
  [CommonErrorCode.CONFLICT]: '资源冲突',
  [CommonErrorCode.SERVICE_UNAVAILABLE]: '服务暂时不可用',
  [CommonErrorCode.METHOD_NOT_ALLOWED]: '请求方法不允许',
  [CommonErrorCode.VALIDATION_ERROR]: '数据验证失败',

  // 认证授权错误
  [CommonErrorCode.INVALID_TOKEN]: '无效的令牌',
  [CommonErrorCode.TOKEN_EXPIRED]: '令牌已过期',
  [CommonErrorCode.INVALID_CREDENTIALS]: '用户名或密码错误',
  [CommonErrorCode.ACCOUNT_DISABLED]: '账户已被禁用',
  [CommonErrorCode.ACCOUNT_LOCKED]: '账户已被锁定',
  [CommonErrorCode.INSUFFICIENT_PERMISSIONS]: '权限不足',
  [CommonErrorCode.ROLE_FORBIDDEN]: '角色权限不足',

  // 用户模块
  [UserErrorCode.USER_NOT_FOUND]: '用户不存在',
  [UserErrorCode.USER_ALREADY_EXISTS]: '用户已存在',
  [UserErrorCode.INVALID_PASSWORD]: '密码错误',
  [UserErrorCode.WEAK_PASSWORD]: '密码强度不足',
  [UserErrorCode.EMAIL_ALREADY_EXISTS]: '邮箱已被注册',
  [UserErrorCode.PHONE_ALREADY_EXISTS]: '手机号已被注册',
  [UserErrorCode.INVALID_EMAIL_FORMAT]: '邮箱格式不正确',
  [UserErrorCode.INVALID_PHONE_FORMAT]: '手机号格式不正确',
  [UserErrorCode.USER_DISABLED]: '用户已被禁用',

  // 课程模块
  [CourseErrorCode.COURSE_NOT_FOUND]: '课程不存在',
  [CourseErrorCode.COURSE_ALREADY_EXISTS]: '课程已存在',
  [CourseErrorCode.COURSE_CODE_DUPLICATE]: '课程代码重复',
  [CourseErrorCode.INVALID_CREDIT]: '学分无效',
  [CourseErrorCode.COURSE_FULL]: '课程人数已满',
  [CourseErrorCode.COURSE_NOT_STARTED]: '课程未开始',
  [CourseErrorCode.COURSE_ENDED]: '课程已结束',

  // 班级模块
  [ClassErrorCode.CLASS_NOT_FOUND]: '班级不存在',
  [ClassErrorCode.CLASS_ALREADY_EXISTS]: '班级已存在',
  [ClassErrorCode.CLASS_CODE_DUPLICATE]: '班级代码重复',
  [ClassErrorCode.CLASS_FULL]: '班级人数已满',
  [ClassErrorCode.CLASS_ENDED]: '班级已结束',

  // 实验模块
  [ExperimentErrorCode.EXPERIMENT_NOT_FOUND]: '实验不存在',
  [ExperimentErrorCode.EXPERIMENT_NOT_STARTED]: '实验未开始',
  [ExperimentErrorCode.EXPERIMENT_ENDED]: '实验已结束',
  [ExperimentErrorCode.EXPERIMENT_CLOSED]: '实验已关闭',
  [ExperimentErrorCode.SUBMIT_TOO_LATE]: '提交已超时',
  [ExperimentErrorCode.SUBMIT_TOO_EARLY]: '提交未开放',
  [ExperimentErrorCode.ALREADY_SUBMITTED]: '已提交过',

  // 考试模块
  [ExaminationErrorCode.EXAMINATION_NOT_FOUND]: '考试不存在',
  [ExaminationErrorCode.EXAMINATION_NOT_STARTED]: '考试未开始',
  [ExaminationErrorCode.EXAMINATION_ENDED]: '考试已结束',
  [ExaminationErrorCode.EXAMINATION_CLOSED]: '考试已关闭',
  [ExaminationErrorCode.EXAMINATION_NOT_PARTICIPANT]: '非考试考生',
  [ExaminationErrorCode.ALREADY_SUBMITTED]: '已提交过',
  [ExaminationErrorCode.SUBMIT_TOO_LATE]: '提交已超时',

  // 成绩模块
  [ScoreErrorCode.SCORE_NOT_FOUND]: '成绩不存在',
  [ScoreErrorCode.INVALID_SCORE]: '成绩无效',
  [ScoreErrorCode.SCORE_ALREADY_EXISTS]: '成绩已存在',
  [ScoreErrorCode.SCORE_NOT_PUBLISHED]: '成绩未发布',
  [ScoreErrorCode.WEIGHT_NOT_CONFIGURED]: '权重未配置',
  [ScoreErrorCode.WEIGHT_INVALID]: '权重配置无效',
  [ScoreErrorCode.WEIGHT_SUM_EXCEED]: '权重总和超过100%',

  // 选课模块
  [EnrollmentErrorCode.ENROLLMENT_NOT_FOUND]: '选课记录不存在',
  [EnrollmentErrorCode.ALREADY_ENROLLED]: '已选过该课程',
  [EnrollmentErrorCode.NOT_ENROLLED]: '未选修该课程',
  [EnrollmentErrorCode.ENROLLMENT_CLOSED]: '选课已结束',
  [EnrollmentErrorCode.ENROLLMENT_NOT_STARTED]: '选课未开始',

  // 文件模块
  [FileErrorCode.FILE_NOT_FOUND]: '文件不存在',
  [FileErrorCode.FILE_TOO_LARGE]: '文件大小超限',
  [FileErrorCode.FILE_TYPE_NOT_ALLOWED]: '文件类型不允许',
  [FileErrorCode.FILE_UPLOAD_FAILED]: '文件上传失败',
  [FileErrorCode.FILE_DOWNLOAD_FAILED]: '文件下载失败',
};
