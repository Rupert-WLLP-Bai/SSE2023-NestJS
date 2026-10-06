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
      const id = Number(username)
      if (!Number.isFinite(id)) {
        ElMessage.error('用户名必须是学号/工号数字')
        return false
      }
      const res = await loginApi.account({ id, password })
      if (res?.success && res.data?.token) {
        token.value = res.data.token
        localStorage.setItem('token', token.value)
        const ok = await fetchCurrentUser()
        if (!ok) {
          // token 可用但资料拉取失败时，至少保留角色名
          userInfo.value = {
            id: String(id),
            username: String(id),
            role: (res.data.currentAuthority?.toUpperCase() || 'STUDENT') as UserRole,
          }
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        }
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
      if (res?.success && res.data) {
        const roleMap: Record<number, UserRole> = {
          0: 'ADMIN',
          1: 'STUDENT',
          2: 'TEACHER',
          3: 'ASSISTANT',
        }
        userInfo.value = {
          id: String(res.data.id),
          username: String(res.data.id),
          name: res.data.name,
          role: roleMap[Number(res.data.role)] || 'STUDENT',
          email: res.data.email,
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
