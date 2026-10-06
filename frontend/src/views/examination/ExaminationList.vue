<template>
  <div class="page-container">
    <div class="page-header"><h2>考试管理</h2><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增考试</el-button></div>
    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="考试名称"><el-input v-model="queryForm.title" placeholder="请输入考试名称" clearable /></el-form-item>
        <el-form-item label="课程"><el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable><el-option v-for="c in courses" :key="c.id" :label="c.name" :value="c.id" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button><el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button></el-form-item>
      </el-form>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="考试名称" />
        <el-table-column prop="courseName" label="课程" />
        <el-table-column prop="examTime" label="考试时间" />
        <el-table-column prop="duration" label="时长(分钟)" width="100" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handleStart(row)" v-if="row.status === 'draft'">开始</el-button>
            <el-button type="warning" link @click="handleEnd(row)" v-if="row.status === 'active'">结束</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleQuery" @current-change="handleQuery" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="考试名称" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="课程" prop="courseId"><el-select v-model="form.courseId" placeholder="请选择课程"><el-option v-for="c in courses" :key="c.id" :label="c.name" :value="c.id" /></el-select></el-form-item>
        <el-form-item label="考试时间" prop="examTime"><el-date-picker v-model="form.examTime" type="datetime" placeholder="选择考试时间" value-format="YYYY-MM-DD HH:mm:ss" /></el-form-item>
        <el-form-item label="时长(分钟)" prop="duration"><el-input-number v-model="form.duration" :min="30" :max="300" /></el-form-item>
        <el-form-item label="考试说明" prop="description"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="handleSubmit">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { examinationApi, courseApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const courses = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const queryForm = reactive({ title: '', courseId: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const form = reactive({ id: '', title: '', courseId: '', examTime: '', duration: 120, description: '' })
const rules: FormRules = { title: [{ required: true, message: '请输入考试名称', trigger: 'blur' }], courseId: [{ required: true, message: '请选择课程', trigger: 'change' }], examTime: [{ required: true, message: '请选择考试时间', trigger: 'change' }] }

const getStatusType = (status: string) => { const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'primary'> = { draft: 'info', active: 'success', ended: 'warning', archived: 'info' }; return map[status] || 'info' }
const getStatusLabel = (status: string) => { const map: Record<string, string> = { draft: '草稿', active: '进行中', ended: '已结束', archived: '已归档' }; return map[status] || status }

const handleQuery = async () => { loading.value = true; try { const res = await examinationApi.list({ page: pagination.page, pageSize: pagination.pageSize, ...queryForm }); tableData.value = res.data?.list || []; pagination.total = res.data?.total || 0 } catch (error) { console.error(error) } finally { loading.value = false } }
const handleReset = () => { queryForm.title = ''; queryForm.courseId = ''; handleQuery() }
const handleAdd = () => { dialogTitle.value = '新增考试'; Object.assign(form, { id: '', title: '', courseId: '', examTime: '', duration: 120, description: '' }); dialogVisible.value = true }
const handleEdit = (row: any) => { dialogTitle.value = '编辑考试'; Object.assign(form, { ...row }); dialogVisible.value = true }
const handleDelete = async (row: any) => { try { await ElMessageBox.confirm('确定要删除该考试吗？', '提示', { type: 'warning' }); await examinationApi.delete(row.id); ElMessage.success('删除成功'); handleQuery() } catch (error) {} }
const handleStart = async (row: any) => { try { await examinationApi.start(row.id); ElMessage.success('考试已开始'); handleQuery() } catch (error) {} }
const handleEnd = async (row: any) => { try { await examinationApi.end(row.id); ElMessage.success('考试已结束'); handleQuery() } catch (error) {} }
const handleSubmit = async () => { if (!formRef.value) return; await formRef.value.validate(async (valid) => { if (!valid) return; try { if (form.id) { await examinationApi.update(form.id, form); ElMessage.success('更新成功') } else { await examinationApi.create(form); ElMessage.success('创建成功') }; dialogVisible.value = false; handleQuery() } catch (error) { console.error(error) } }) }

onMounted(() => { handleQuery(); (async () => { const res = await courseApi.list({ pageSize: 100 }); courses.value = res.data?.list || [] })() })
</script>

<style scoped>.page-container { padding: 20px; }.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }.page-header h2 { margin: 0; }.search-form { margin-bottom: 20px; }</style>
