import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/stores/auth'

// 静态导入所有页面组件
const Login = () => import('@/views/common/Login.vue')
const Dashboard = () => import('@/views/common/Dashboard.vue')
const NotFound = () => import('@/views/common/NotFound.vue')
const Forbidden = () => import('@/views/common/Forbidden.vue')

// 用户管理
const UserList = () => import('@/views/system/UserList.vue')

// 课程管理
const CourseList = () => import('@/views/common/CourseList.vue')

// 班级管理
const ClassList = () => import('@/views/common/ClassList.vue')

// 选课管理
const EnrollmentList = () => import('@/views/common/EnrollmentList.vue')

// 公告管理
const NoticeList = () => import('@/views/common/NoticeList.vue')
const NoticeDetail = () => import('@/views/common/NoticeDetail.vue')

// 文件管理
const FileList = () => import('@/views/file/FileList.vue')

// 实验管理
const ExperimentList = () => import('@/views/experiment/ExperimentList.vue')
const ExperimentSubmitList = () => import('@/views/experiment/ExperimentSubmitList.vue')
const ExperimentScoreList = () => import('@/views/experiment/ExperimentScoreList.vue')
const ExperimentWeightList = () => import('@/views/experiment/ExperimentWeightList.vue')

// 考试管理
const ExaminationList = () => import('@/views/examination/ExaminationList.vue')
const ExaminationSubmitList = () => import('@/views/examination/ExaminationSubmitList.vue')
const ExaminationScoreList = () => import('@/views/examination/ExaminationScoreList.vue')
const ExaminationWeightList = () => import('@/views/examination/ExaminationWeightList.vue')
const ExaminationProblemList = () => import('@/views/examination/ExaminationProblemList.vue')
const ExaminationStudentList = () => import('@/views/examination/ExaminationStudentList.vue')

// 汇总分析
const TotalScoreList = () => import('@/views/analysis/TotalScoreList.vue')
const TotalWeightList = () => import('@/views/analysis/TotalWeightList.vue')
const GradeReport = () => import('@/views/analysis/GradeReport.vue')
const AuditLog = () => import('@/views/analysis/AuditLog.vue')

// 路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, title: '首页', roles: ['ADMIN', 'TEACHER', 'ASSISTANT', 'STUDENT'] }
      },
      // 系统管理
      {
        path: 'system/user',
        name: 'UserList',
        component: UserList,
        meta: { requiresAuth: true, title: '用户管理', roles: ['ADMIN'] }
      },
      // 通用模块
      {
        path: 'common/course',
        name: 'CourseList',
        component: CourseList,
        meta: { requiresAuth: true, title: '课程管理', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'common/class',
        name: 'ClassList',
        component: ClassList,
        meta: { requiresAuth: true, title: '班级管理', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'common/enrollment',
        name: 'EnrollmentList',
        component: EnrollmentList,
        meta: { requiresAuth: true, title: '选课管理', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'common/notice',
        name: 'NoticeList',
        component: NoticeList,
        meta: { requiresAuth: true, title: '公告管理', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'common/notice/:id',
        name: 'NoticeDetail',
        component: NoticeDetail,
        meta: { requiresAuth: true, title: '公告详情', roles: ['ADMIN', 'TEACHER', 'ASSISTANT', 'STUDENT'] }
      },
      // 文件模块
      {
        path: 'file/list',
        name: 'FileList',
        component: FileList,
        meta: { requiresAuth: true, title: '文件管理', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      // 实验链路
      {
        path: 'experiment/list',
        name: 'ExperimentList',
        component: ExperimentList,
        meta: { requiresAuth: true, title: '实验管理', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'experiment/submit',
        name: 'ExperimentSubmitList',
        component: ExperimentSubmitList,
        meta: { requiresAuth: true, title: '实验提交', roles: ['ADMIN', 'TEACHER', 'ASSISTANT', 'STUDENT'] }
      },
      {
        path: 'experiment/score',
        name: 'ExperimentScoreList',
        component: ExperimentScoreList,
        meta: { requiresAuth: true, title: '实验成绩', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'experiment/weight',
        name: 'ExperimentWeightList',
        component: ExperimentWeightList,
        meta: { requiresAuth: true, title: '实验权重', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      // 考试链路
      {
        path: 'examination/list',
        name: 'ExaminationList',
        component: ExaminationList,
        meta: { requiresAuth: true, title: '考试管理', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'examination/submit',
        name: 'ExaminationSubmitList',
        component: ExaminationSubmitList,
        meta: { requiresAuth: true, title: '考试提交', roles: ['ADMIN', 'TEACHER', 'ASSISTANT', 'STUDENT'] }
      },
      {
        path: 'examination/score',
        name: 'ExaminationScoreList',
        component: ExaminationScoreList,
        meta: { requiresAuth: true, title: '考试成绩', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'examination/weight',
        name: 'ExaminationWeightList',
        component: ExaminationWeightList,
        meta: { requiresAuth: true, title: '考试权重', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'examination/problem',
        name: 'ExaminationProblemList',
        component: ExaminationProblemList,
        meta: { requiresAuth: true, title: '考试题目', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'examination/student',
        name: 'ExaminationStudentList',
        component: ExaminationStudentList,
        meta: { requiresAuth: true, title: '考试学生', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      // 汇总分析
      {
        path: 'analysis/total-score',
        name: 'TotalScoreList',
        component: TotalScoreList,
        meta: { requiresAuth: true, title: '总成绩', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'analysis/total-weight',
        name: 'TotalWeightList',
        component: TotalWeightList,
        meta: { requiresAuth: true, title: '总权重', roles: ['ADMIN', 'TEACHER', 'ASSISTANT'] }
      },
      {
        path: 'analysis/grade-report',
        name: 'GradeReport',
        component: GradeReport,
        meta: { requiresAuth: true, title: '成绩报表', roles: ['ADMIN', 'TEACHER', 'ASSISTANT', 'STUDENT'] }
      },
      {
        path: 'analysis/audit',
        name: 'AuditLog',
        component: AuditLog,
        meta: { requiresAuth: true, title: '审计日志', roles: ['ADMIN'] }
      },
    ]
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresAuth: false, title: '404' }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: { requiresAuth: false, title: '403' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false
  const roles = to.meta.roles as UserRole[] | undefined

  // 设置页面标题
  document.title = (to.meta.title as string) || '教学管理系统'

  // 需要登录但未登录
  if (requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 已登录但访问登录页
  if (to.name === 'Login' && authStore.isLoggedIn) {
    next({ name: 'Dashboard' })
    return
  }

  // 角色权限检查
  if (roles && roles.length > 0 && !roles.includes(authStore.userRole as UserRole)) {
    next({ name: 'Forbidden' })
    return
  }

  next()
})

export default router
