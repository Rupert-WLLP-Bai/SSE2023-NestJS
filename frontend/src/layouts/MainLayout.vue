<template>
  <el-container class="main-layout">
    <!-- 侧边栏 -->
    <el-aside width="220px">
      <div class="logo">
        <h3>教学管理系统</h3>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :router="true"
        :collapse="isCollapse"
      >
        <el-menu-item index="/dashboard">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-sub-menu index="system" v-if="hasRole(['ADMIN'])">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/user">用户管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="common">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>通用模块</span>
          </template>
          <el-menu-item index="/common/course">课程管理</el-menu-item>
          <el-menu-item index="/common/class">班级管理</el-menu-item>
          <el-menu-item index="/common/enrollment">选课管理</el-menu-item>
          <el-menu-item index="/common/notice">公告管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="file" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">
          <template #title>
            <el-icon><Folder /></el-icon>
            <span>文件模块</span>
          </template>
          <el-menu-item index="/file/list">文件管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="experiment">
          <template #title>
            <el-icon><Cpu /></el-icon>
            <span>实验链路</span>
          </template>
          <el-menu-item index="/experiment/list" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">实验管理</el-menu-item>
          <el-menu-item index="/experiment/submit">实验提交</el-menu-item>
          <el-menu-item index="/experiment/score" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">实验成绩</el-menu-item>
          <el-menu-item index="/experiment/weight" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">实验权重</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="examination">
          <template #title>
            <el-icon><EditPen /></el-icon>
            <span>考试链路</span>
          </template>
          <el-menu-item index="/examination/list" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">考试管理</el-menu-item>
          <el-menu-item index="/examination/submit">考试提交</el-menu-item>
          <el-menu-item index="/examination/score" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">考试成绩</el-menu-item>
          <el-menu-item index="/examination/weight" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">考试权重</el-menu-item>
          <el-menu-item index="/examination/problem" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">考试题目</el-menu-item>
          <el-menu-item index="/examination/student" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">考试学生</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="analysis">
          <template #title>
            <el-icon><DataAnalysis /></el-icon>
            <span>汇总分析</span>
          </template>
          <el-menu-item index="/analysis/total-score" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">总成绩</el-menu-item>
          <el-menu-item index="/analysis/total-weight" v-if="hasRole(['ADMIN', 'TEACHER', 'ASSISTANT'])">总权重</el-menu-item>
          <el-menu-item index="/analysis/grade-report">成绩报表</el-menu-item>
          <el-menu-item index="/analysis/audit" v-if="hasRole(['ADMIN'])">审计日志</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部导航 -->
      <el-header>
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><User /></el-icon>
              <span>{{ userInfo?.name || userInfo?.username }}</span>
              <el-tag size="small" :type="roleTagType">{{ userInfo?.role }}</el-tag>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore, type UserRole } from '@/stores/auth'
import { House, Setting, Document, Folder, Cpu, EditPen, DataAnalysis, User, Fold, Expand } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isCollapse = ref(false)
const userInfo = computed(() => authStore.userInfo)
const activeMenu = computed(() => route.path)

const roleTagType = computed(() => {
  const map: Record<UserRole, 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
    ADMIN: 'danger',
    TEACHER: 'warning',
    ASSISTANT: 'success',
    STUDENT: 'info'
  }
  return map[userInfo.value?.role as UserRole] || 'info'
})

const hasRole = (roles: UserRole[]) => {
  return roles.includes(userInfo.value?.role as UserRole)
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    await authStore.logout()
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
  color: #fff;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #263445;
}

.logo h3 {
  color: #fff;
  font-size: 16px;
  margin: 0;
}

.el-menu-vertical {
  border-right: none;
  background-color: #304156;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
}

.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
