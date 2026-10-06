import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi, commonApi } from '@/api'
import { ElMessage } from 'element-plus'

export type UserRole = 'ADMIN' | 'TEACHER' | 'ASSISTANT' | 'STUDENT'

export interface UserInfo {
  id: string
  username: string
  name?: string
  role: UserRole
  email?: string
  studentId?: string
  teacherId?: string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')!)
      : null
  )

  const isLoggedIn = computed(() => !!token.value)
  const userRole = computed(() => userInfo.value?.role || '')

  // 角色权限映射
  const rolePermissions: Record<UserRole, string[]> = {
    ADMIN: ['*'],
    TEACHER: ['user', 'course', 'class', 'enrollment', 'notice', 'experiment', 'experiment-submit', 'experiment-score', 'experiment-weight', 'examination', 'examination-submit', 'examination-score', 'examination-weight', 'examination-problem-list', 'examination-student-list', 'total-score', 'total-weight', 'grade-report', 'file'],
    ASSISTANT: ['course', 'class', 'enrollment', 'notice', 'experiment', 'experiment-submit', 'experiment-score', 'experiment-weight', 'examination', 'examination-submit', 'examination-score', 'examination-weight', 'examination-problem-list', 'examination-student-list', 'total-score', 'total-weight', 'grade-report', 'file'],
    STUDENT: ['course', 'enrollment', 'notice', 'experiment', 'experiment-submit', 'examination', 'examination-submit', 'total-score', 'grade-report'],
  }

  const hasPermission = (permission: string): boolean => {
    if (!userInfo.value) return false
    const permissions = rolePermissions[userInfo.value.role]
    return permissions.includes('*') || permissions.includes(permission)
  }

  const login = async (username: string, password: string) => {
    try {
      const res = await loginApi.account({ username, password })
      if (res.data) {
        token.value = res.data.accessToken
        userInfo.value = {
          id: res.data.user.id,
          username: res.data.user.username,
          name: res.data.user.name,
          role: res.data.user.role,
          email: res.data.user.email,
          studentId: res.data.user.studentId,
          teacherId: res.data.user.teacherId,
        }
        localStorage.setItem('token', token.value)
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        ElMessage.success('登录成功')
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const logout = async () => {
    try {
      await loginApi.outlogin()
    } catch (error) {
      // 忽略登出错误
    } finally {
      token.value = ''
      userInfo.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return false
    try {
      const res = await commonApi.getCurrentUser()
      if (res.data) {
        userInfo.value = {
          id: res.data.id,
          username: res.data.username,
          name: res.data.name,
          role: res.data.role,
          email: res.data.email,
          studentId: res.data.studentId,
          teacherId: res.data.teacherId,
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        return true
      }
      return false
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    userRole,
    hasPermission,
    login,
    logout,
    fetchCurrentUser,
  }
})
