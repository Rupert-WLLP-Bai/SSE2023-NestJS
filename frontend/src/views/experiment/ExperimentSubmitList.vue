<template>
  <div class="page-container">
    <div class="page-header">
      <h2>实验提交</h2>
      <el-button type="primary" @click="handleAdd" v-if="isStudent"><el-icon><Plus /></el-icon>提交实验</el-button>
    </div>

    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="实验"><el-select v-model="queryForm.experimentId" placeholder="请选择实验" clearable><el-option v-for="e in experiments" :key="e.id" :label="e.title" :value="e.id" /></el-select></el-form-item>
        <el-form-item label="学生"><el-input v-model="queryForm.studentName" placeholder="请输入学生姓名" clearable /></el-form-item>
        <el-form-item><el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button><el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="experimentTitle" label="实验名称" />
        <el-table-column prop="studentName" label="学生姓名" />
        <el-table-column prop="fileName" label="提交文件" />
        <el-table-column prop="submittedAt" label="提交时间" width="180" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'submitted' ? 'success' : row.status === 'graded' ? 'warning' : 'info'">{{ row.status === 'submitted' ? '已提交' : row.status === 'graded' ? '已评分' : '未提交' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDownload(row)">下载</el-button>
            <el-button type="danger" link @click="handleDelete(row)" v-if="!isStudent">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleQuery" @current-change="handleQuery" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>

    <el-dialog v-model="dialogVisible" title="提交实验" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="选择实验" prop="experimentId"><el-select v-model="form.experimentId" placeholder="请选择实验"><el-option v-for="e in experiments" :key="e.id" :label="e.title" :value="e.id" /></el-select></el-form-item>
        <el-form-item label="上传文件" prop="file"><el-upload ref="uploadRef" :auto-upload="false" :limit="1" :on-change="handleFileChange"><el-button type="primary">选择文件</el-button></el-upload></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadFile } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { experimentSubmitApi, experimentApi, experimentScoreApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isStudent = computed(() => authStore.userRole === 'STUDENT')
const loading = ref(false)
const tableData = ref([])
const experiments = ref<any[]>([])
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const uploadRef = ref()

const queryForm = reactive({ experimentId: '', studentName: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const form = reactive({ experimentId: '', studentId: '', file: null as File | null })
const rules: FormRules = { experimentId: [{ required: true, message: '请选择实验', trigger: 'change' }] }

const handleQuery = async () => { loading.value = true; try { const res = await experimentSubmitApi.list({ page: pagination.page, pageSize: pagination.pageSize, ...queryForm }); tableData.value = res.data?.list || []; pagination.total = res.data?.total || 0 } catch (error) { console.error(error) } finally { loading.value = false } }
const handleReset = () => { queryForm.experimentId = ''; queryForm.studentName = ''; handleQuery() }
const handleAdd = () => { Object.assign(form, { experimentId: '', studentId: authStore.userInfo?.id, file: null }); dialogVisible.value = true }
const handleFileChange = (file: UploadFile) => { form.file = file.raw || null }
const handleDownload = async (row: any) => { ElMessage.info('下载功能待实现') }
const handleDelete = async (row: any) => { try { await ElMessageBox.confirm('确定要删除该提交吗？', '提示', { type: 'warning' }); await experimentSubmitApi.delete(row.id); ElMessage.success('删除成功'); handleQuery() } catch (error) {} }
const handleSubmit = async () => { if (!formRef.value) return; await formRef.value.validate(async (valid) => { if (!valid) return; if (!form.file) { ElMessage.warning('请选择文件'); return }; try { const formData = new FormData(); formData.append('file', form.file); formData.append('experimentId', form.experimentId); formData.append('studentId', form.studentId || ''); await experimentSubmitApi.create(formData as any); ElMessage.success('提交成功'); dialogVisible.value = false; handleQuery() } catch (error) { console.error(error) } }) }

onMounted(() => { handleQuery(); (async () => { const res = await experimentApi.list({ pageSize: 100 }); experiments.value = res.data?.list || [] })() })
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { margin: 0; }
.search-form { margin-bottom: 20px; }
</style>
