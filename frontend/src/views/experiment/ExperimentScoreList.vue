<template>
  <div class="page-container">
    <div class="page-header"><h2>实验成绩</h2></div>
    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="实验"><el-select v-model="queryForm.experimentId" placeholder="请选择实验" clearable><el-option v-for="e in experiments" :key="e.id" :label="e.title" :value="e.id" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button><el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button></el-form-item>
      </el-form>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="experimentTitle" label="实验" />
        <el-table-column prop="studentName" label="学生" />
        <el-table-column prop="score" label="成绩" width="100" />
        <el-table-column prop="comment" label="评语" show-overflow-tooltip />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">评分</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleQuery" @current-change="handleQuery" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
    <el-dialog v-model="dialogVisible" title="评分" width="400px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="成绩"><el-input-number v-model="form.score" :min="0" :max="100" /></el-form-item>
        <el-form-item label="评语"><el-input v-model="form.comment" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { experimentScoreApi, experimentApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const experiments = ref<any[]>([])
const dialogVisible = ref(false)
const formRef = ref()
const queryForm = reactive({ experimentId: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const form = reactive({ id: '', experimentId: '', studentId: '', score: 0, comment: '' })

const handleQuery = async () => { loading.value = true; try { const res = await experimentScoreApi.list({ page: pagination.page, pageSize: pagination.pageSize, ...queryForm }); tableData.value = res.data?.list || []; pagination.total = res.data?.total || 0 } catch (error) { console.error(error) } finally { loading.value = false } }
const handleReset = () => { queryForm.experimentId = ''; handleQuery() }
const handleEdit = (row: any) => { Object.assign(form, { ...row }); dialogVisible.value = true }
const handleSubmit = async () => { try { await experimentScoreApi.upsert({ id: form.id, experimentId: form.experimentId, studentId: form.studentId, score: form.score, comment: form.comment }); ElMessage.success('保存成功'); dialogVisible.value = false; handleQuery() } catch (error) { console.error(error) } }

onMounted(() => { handleQuery(); (async () => { const res = await experimentApi.list({ pageSize: 100 }); experiments.value = res.data?.list || [] })() })
</script>

<style scoped>.page-container { padding: 20px; }.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }.page-header h2 { margin: 0; }.search-form { margin-bottom: 20px; }</style>
