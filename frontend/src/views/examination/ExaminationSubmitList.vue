<template>
  <div class="page-container">
    <div class="page-header"><h2>考试提交</h2></div>
    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="考试"><el-select v-model="queryForm.examinationId" placeholder="请选择考试" clearable><el-option v-for="e in examinations" :key="e.id" :label="e.title" :value="e.id" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button><el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button></el-form-item>
      </el-form>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="examinationTitle" label="考试" />
        <el-table-column prop="studentName" label="学生" />
        <el-table-column prop="problemTitle" label="题目" />
        <el-table-column prop="submittedAt" label="提交时间" width="180" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }"><el-tag :type="row.isGraded ? 'success' : 'warning'">{{ row.isGraded ? '已评分' : '待评分' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150"><template #default="{ row }"><el-button type="primary" link @click="handleView(row)">查看</el-button></template></el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleQuery" @current-change="handleQuery" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { examinationSubmitApi, examinationApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const examinations = ref<any[]>([])
const queryForm = reactive({ examinationId: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const handleQuery = async () => { loading.value = true; try { const res = await examinationSubmitApi.list({ page: pagination.page, pageSize: pagination.pageSize, ...queryForm }); tableData.value = res.data?.list || []; pagination.total = res.data?.total || 0 } catch (error) { console.error(error) } finally { loading.value = false } }
const handleReset = () => { queryForm.examinationId = ''; handleQuery() }
const handleView = (row: any) => { console.log('查看提交', row) }

onMounted(() => { handleQuery(); (async () => { const res = await examinationApi.list({ pageSize: 100 }); examinations.value = res.data?.list || [] })() })
</script>

<style scoped>.page-container { padding: 20px; }.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }.page-header h2 { margin: 0; }.search-form { margin-bottom: 20px; }</style>
