<template>
  <div class="page-container">
    <div class="page-header"><h2>成绩报表</h2></div>
    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="课程"><el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable><el-option v-for="c in courses" :key="c.id" :label="c.name" :value="c.id" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button><el-button type="success" @click="handleExport" :disabled="!queryForm.courseId"><el-icon><Download /></el-icon>导出成绩</el-button></el-form-item>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="12">
          <v-chart :option="barChartOption" style="height: 300px" />
        </el-col>
        <el-col :span="12">
          <v-chart :option="pieChartOption" style="height: 300px" />
        </el-col>
      </el-row>
      <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="studentName" label="学生姓名" />
        <el-table-column prop="studentId" label="学号" />
        <el-table-column prop="totalScore" label="总成绩" />
        <el-table-column prop="grade" label="等级">
          <template #default="{ row }"><el-tag>{{ row.grade }}</el-tag></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { Search, Download } from '@element-plus/icons-vue'
import { gradeReportApi, courseApi, totalScoreApi } from '@/api'

use([CanvasRenderer, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const loading = ref(false)
const courses = ref<any[]>([])
const tableData = ref<any[]>([])
const stats = ref<any>({})
const queryForm = reactive({ courseId: '' })

const handleQuery = async () => { if (!queryForm.courseId) return; loading.value = true; try { const [scoreRes, statsRes] = await Promise.all([totalScoreApi.getByCourse(queryForm.courseId), gradeReportApi.getCourseStats(queryForm.courseId)]); tableData.value = scoreRes.data?.list || []; stats.value = statsRes.data || {} } catch (error) { console.error(error) } finally { loading.value = false } }
const handleExport = async () => { try { const res = await gradeReportApi.exportCsv(queryForm.courseId); const blob = new Blob([res as any], { type: 'application/vnd.ms-excel' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = '成绩单.csv'; a.click(); URL.revokeObjectURL(url) } catch (error) { console.error(error) } }

const barChartOption = computed(() => ({ tooltip: { trigger: 'axis' }, xAxis: { type: 'category', data: ['0-60', '60-70', '70-80', '80-90', '90-100'] }, yAxis: { type: 'value' }, series: [{ name: '人数', type: 'bar', data: [stats.value.distribution || 0, stats.value.distribution || 0, stats.value.distribution || 0, stats.value.distribution || 0, stats.value.distribution || 0] }] }))
const pieChartOption = computed(() => ({ tooltip: { trigger: 'item' }, series: [{ name: '成绩分布', type: 'pie', radius: '50%', data: [{ value: 10, name: 'A' }, { value: 20, name: 'B' }, { value: 30, name: 'C' }, { value: 15, name: 'D' }] }] }))

onMounted(() => { (async () => { const res = await courseApi.list({ pageSize: 100 }); courses.value = res.data?.list || [] })() })
</script>

<style scoped>.page-container { padding: 20px; }.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }.page-header h2 { margin: 0; }.search-form { margin-bottom: 20px; }</style>
