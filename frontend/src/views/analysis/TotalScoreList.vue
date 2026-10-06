<template>
  <div class="page-container">
    <div class="page-header"><h2>总成绩</h2></div>
    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="课程"><el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable @change="handleQuery"><el-option v-for="c in courses" :key="c.id" :label="c.name" :value="c.id" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button><el-button type="success" @click="handleRecalculate" :disabled="!queryForm.courseId">重新计算</el-button></el-form-item>
      </el-form>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="studentName" label="学生姓名" />
        <el-table-column prop="studentId" label="学号" />
        <el-table-column prop="courseName" label="课程" />
        <el-table-column prop="experimentScore" label="实验成绩" />
        <el-table-column prop="examinationScore" label="考试成绩" />
        <el-table-column prop="totalScore" label="总成绩" />
        <el-table-column prop="grade" label="等级">
          <template #default="{ row }"><el-tag :type="getGradeType(row.grade)">{{ row.grade }}</el-tag></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { totalScoreApi, courseApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const courses = ref<any[]>([])
const queryForm = reactive({ courseId: '' })

const getGradeType = (grade: string) => { const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'primary'> = { A: 'success', B: 'warning', C: 'info', D: 'danger' }; return map[grade] || 'info' }

const handleQuery = async () => { loading.value = true; try { const res = queryForm.courseId ? await totalScoreApi.getByCourse(queryForm.courseId) : await totalScoreApi.list({ pageSize: 100 }); tableData.value = res.data?.list || res.data || [] } catch (error) { console.error(error) } finally { loading.value = false } }
const handleRecalculate = async () => { if (!queryForm.courseId) return; try { await totalScoreApi.recalculate(queryForm.courseId); ElMessage.success('重新计算完成'); handleQuery() } catch (error) { console.error(error) } }

onMounted(() => { handleQuery(); (async () => { const res = await courseApi.list({ pageSize: 100 }); courses.value = res.data?.list || [] })() })
</script>

<style scoped>.page-container { padding: 20px; }.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }.page-header h2 { margin: 0; }.search-form { margin-bottom: 20px; }</style>
