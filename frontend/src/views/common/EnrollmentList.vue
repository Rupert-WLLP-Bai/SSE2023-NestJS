<template>
  <div class="page-container">
    <div class="page-header">
      <h2>选课管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增选课
      </el-button>
    </div>

    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="学生">
          <el-input v-model="queryForm.studentName" placeholder="请输入学生姓名" clearable />
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="queryForm.classId" placeholder="请选择班级" clearable>
            <el-option v-for="c in classes" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="studentName" label="学生姓名" />
        <el-table-column prop="studentId" label="学号" />
        <el-table-column prop="className" label="班级" />
        <el-table-column prop="courseName" label="课程" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '已选课' : '已退课' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
            <el-button type="warning" link @click="handleDrop(row)" v-if="row.status === 'active'">退课</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
        :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleQuery" @current-change="handleQuery" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="学生" prop="studentId">
          <el-select v-model="form.studentId" placeholder="请选择学生" filterable>
            <el-option v-for="s in students" :key="s.id" :label="`${s.name} (${s.username})`" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="classId">
          <el-select v-model="form.classId" placeholder="请选择班级">
            <el-option v-for="c in classes" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
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
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { enrollmentApi, classApi, userApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const classes = ref<any[]>([])
const students = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

const queryForm = reactive({ studentName: '', classId: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const form = reactive({ id: '', studentId: '', classId: '' })
const rules: FormRules = { studentId: [{ required: true, message: '请选择学生', trigger: 'change' }], classId: [{ required: true, message: '请选择班级', trigger: 'change' }] }

const handleQuery = async () => {
  loading.value = true
  try {
    const res = await enrollmentApi.list({ page: pagination.page, pageSize: pagination.pageSize, ...queryForm })
    tableData.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) { console.error(error) }
  finally { loading.value = false }
}
const handleReset = () => { queryForm.studentName = ''; queryForm.classId = ''; handleQuery() }
const handleAdd = () => { dialogTitle.value = '新增选课'; Object.assign(form, { id: '', studentId: '', classId: '' }); dialogVisible.value = true }
const handleEdit = (row: any) => { dialogTitle.value = '编辑选课'; Object.assign(form, { ...row }); dialogVisible.value = true }
const handleDelete = async (row: any) => {
  try { await ElMessageBox.confirm('确定要删除该选课记录吗？', '提示', { type: 'warning' }); await enrollmentApi.delete(row.id); ElMessage.success('删除成功'); handleQuery() } catch (error) {}
}
const handleDrop = async (row: any) => {
  try { await ElMessageBox.confirm('确定要退课吗？', '提示', { type: 'warning' }); await enrollmentApi.drop(row.studentId, row.classId); ElMessage.success('退课成功'); handleQuery() } catch (error) {}
}
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (form.id) { await enrollmentApi.update(form.id, form); ElMessage.success('更新成功') }
      else { await enrollmentApi.create(form); ElMessage.success('创建成功') }
      dialogVisible.value = false; handleQuery()
    } catch (error) { console.error(error) }
  })
}

onMounted(() => { handleQuery(); (async () => { const r1 = await classApi.list({ pageSize: 100 }); classes.value = r1.data?.list || []; const r2 = await userApi.list({ role: 'STUDENT', pageSize: 100 }); students.value = r2.data?.list || [] })() })
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { margin: 0; }
.search-form { margin-bottom: 20px; }
</style>
