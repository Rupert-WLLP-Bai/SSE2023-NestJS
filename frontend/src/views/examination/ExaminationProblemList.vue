<template>
  <div class="page-container">
    <div class="page-header"><h2>考试题目</h2><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增题目</el-button></div>
    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="考试"><el-select v-model="queryForm.examinationId" placeholder="请选择考试" clearable @change="handleQuery"><el-option v-for="e in examinations" :key="e.id" :label="e.title" :value="e.id" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button><el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button></el-form-item>
      </el-form>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="题目" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="score" label="分值" width="80" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="考试" prop="examinationId"><el-select v-model="form.examinationId" placeholder="请选择考试"><el-option v-for="e in examinations" :key="e.id" :label="e.title" :value="e.id" /></el-select></el-form-item>
        <el-form-item label="题目" prop="title"><el-input v-model="form.title" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="类型" prop="type"><el-select v-model="form.type"><el-option label="选择题" value="choice" /><el-option label="填空题" value="blank" /><el-option label="编程题" value="code" /></el-select></el-form-item>
        <el-form-item label="分值" prop="score"><el-input-number v-model="form.score" :min="1" :max="100" /></el-form-item>
        <el-form-item label="答案" prop="answer"><el-input v-model="form.answer" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="handleSubmit">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { examinationProblemListApi, examinationApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const examinations = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const queryForm = reactive({ examinationId: '' })
const form = reactive({ id: '', examinationId: '', title: '', type: 'choice', score: 10, answer: '' })
const rules: FormRules = { examinationId: [{ required: true, message: '请选择考试', trigger: 'change' }], title: [{ required: true, message: '请输入题目', trigger: 'blur' }] }

const handleQuery = async () => { loading.value = true; try { const res = queryForm.examinationId ? await examinationProblemListApi.getByExamination(queryForm.examinationId) : await examinationProblemListApi.list({ pageSize: 100 }); tableData.value = res.data?.list || res.data || [] } catch (error) { console.error(error) } finally { loading.value = false } }
const handleReset = () => { queryForm.examinationId = ''; handleQuery() }
const handleAdd = () => { dialogTitle.value = '新增题目'; Object.assign(form, { id: '', examinationId: queryForm.examinationId || '', title: '', type: 'choice', score: 10, answer: '' }); dialogVisible.value = true }
const handleEdit = (row: any) => { dialogTitle.value = '编辑题目'; Object.assign(form, { ...row }); dialogVisible.value = true }
const handleDelete = async (row: any) => { try { await ElMessageBox.confirm('确定要删除吗？', '提示', { type: 'warning' }); await examinationProblemListApi.delete(row.id); ElMessage.success('删除成功'); handleQuery() } catch (error) {} }
const handleSubmit = async () => { if (!formRef.value) return; await formRef.value.validate(async (valid) => { if (!valid) return; try { if (form.id) { await examinationProblemListApi.update(form.id, form); ElMessage.success('更新成功') } else { await examinationProblemListApi.create(form); ElMessage.success('创建成功') }; dialogVisible.value = false; handleQuery() } catch (error) { console.error(error) } }) }

onMounted(() => { handleQuery(); (async () => { const res = await examinationApi.list({ pageSize: 100 }); examinations.value = res.data?.list || [] })() })
</script>

<style scoped>.page-container { padding: 20px; }.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }.page-header h2 { margin: 0; }.search-form { margin-bottom: 20px; }</style>
