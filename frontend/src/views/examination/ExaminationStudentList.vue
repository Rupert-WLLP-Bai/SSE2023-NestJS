<template>
  <div class="page-container">
    <div class="page-header"><h2>考试学生</h2><el-button type="primary" @click="handleImport"><el-icon><Plus /></el-icon>导入学生</el-button></div>
    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="考试"><el-select v-model="queryForm.examinationId" placeholder="请选择考试" clearable @change="handleQuery"><el-option v-for="e in examinations" :key="e.id" :label="e.title" :value="e.id" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button><el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button></el-form-item>
      </el-form>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="examinationTitle" label="考试" />
        <el-table-column prop="studentName" label="学生姓名" />
        <el-table-column prop="studentId" label="学号" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }"><el-tag :type="row.status === 'checked' ? 'success' : 'info'">{{ row.status === 'checked' ? '已入场' : '未入场' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }"><el-button type="danger" link @click="handleDelete(row)">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" title="导入学生" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="考试" prop="examinationId"><el-select v-model="form.examinationId" placeholder="请选择考试"><el-option v-for="e in examinations" :key="e.id" :label="e.title" :value="e.id" /></el-select></el-form-item>
        <el-form-item label="班级" prop="classId"><el-select v-model="form.classId" placeholder="请选择班级"><el-option v-for="c in classes" :key="c.id" :label="c.name" :value="c.id" /></el-select></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="handleSubmit">导入</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { examinationStudentListApi, examinationApi, classApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const examinations = ref<any[]>([])
const classes = ref<any[]>([])
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const queryForm = reactive({ examinationId: '' })
const form = reactive({ examinationId: '', classId: '' })
const rules: FormRules = { examinationId: [{ required: true, message: '请选择考试', trigger: 'change' }], classId: [{ required: true, message: '请选择班级', trigger: 'change' }] }

const handleQuery = async () => { loading.value = true; try { const res = queryForm.examinationId ? await examinationStudentListApi.getByExamination(queryForm.examinationId) : await examinationStudentListApi.list({ pageSize: 100 }); tableData.value = res.data?.list || res.data || [] } catch (error) { console.error(error) } finally { loading.value = false } }
const handleReset = () => { queryForm.examinationId = ''; handleQuery() }
const handleImport = () => { Object.assign(form, { examinationId: '', classId: '' }); dialogVisible.value = true }
const handleDelete = async (row: any) => { try { await ElMessageBox.confirm('确定要删除吗？', '提示', { type: 'warning' }); await examinationStudentListApi.delete(row.id); ElMessage.success('删除成功'); handleQuery() } catch (error) {} }
const handleSubmit = async () => { if (!formRef.value) return; await formRef.value.validate(async (valid) => { if (!valid) return; try { await examinationStudentListApi.importClass(form.examinationId, form.classId); ElMessage.success('导入成功'); dialogVisible.value = false; handleQuery() } catch (error) { console.error(error) } }) }

onMounted(() => { handleQuery(); (async () => { const [e, c] = await Promise.all([examinationApi.list({ pageSize: 100 }), classApi.list({ pageSize: 100 })]); examinations.value = e.data?.list || []; classes.value = c.data?.list || [] })() })
</script>

<style scoped>.page-container { padding: 20px; }.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }.page-header h2 { margin: 0; }.search-form { margin-bottom: 20px; }</style>
