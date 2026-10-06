<template>
  <div class="page-container">
    <div class="page-header">
      <h2>班级管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增班级
      </el-button>
    </div>

    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="班级名称">
          <el-input v-model="queryForm.name" placeholder="请输入班级名称" clearable />
        </el-form-item>
        <el-form-item label="课程">
          <el-select v-model="queryForm.courseId" placeholder="请选择课程" clearable>
            <el-option v-for="c in courses" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="班级名称" />
        <el-table-column prop="courseName" label="所属课程" />
        <el-table-column prop="teacherName" label="授课教师" />
        <el-table-column prop="studentCount" label="学生人数" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
        :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleQuery" @current-change="handleQuery" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所属课程" prop="courseId">
          <el-select v-model="form.courseId" placeholder="请选择课程">
            <el-option v-for="c in courses" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="授课教师" prop="teacherId">
          <el-select v-model="form.teacherId" placeholder="请选择教师">
            <el-option v-for="t in teachers" :key="t.id" :label="t.name" :value="t.id" />
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
import { classApi, courseApi, userApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const courses = ref<any[]>([])
const teachers = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

const queryForm = reactive({ name: '', courseId: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const form = reactive({ id: '', name: '', courseId: '', teacherId: '' })
const rules: FormRules = { name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }] }

const handleQuery = async () => {
  loading.value = true
  try {
    const res = await classApi.list({ page: pagination.page, pageSize: pagination.pageSize, ...queryForm })
    tableData.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) { console.error(error) }
  finally { loading.value = false }
}
const handleReset = () => { queryForm.name = ''; queryForm.courseId = ''; handleQuery() }
const handleAdd = () => { dialogTitle.value = '新增班级'; Object.assign(form, { id: '', name: '', courseId: '', teacherId: '' }); dialogVisible.value = true }
const handleEdit = (row: any) => { dialogTitle.value = '编辑班级'; Object.assign(form, { ...row }); dialogVisible.value = true }
const handleDelete = async (row: any) => {
  try { await ElMessageBox.confirm('确定要删除该班级吗？', '提示', { type: 'warning' }); await classApi.delete(row.id); ElMessage.success('删除成功'); handleQuery() } catch (error) {}
}
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (form.id) { await classApi.update(form.id, form); ElMessage.success('更新成功') }
      else { await classApi.create(form); ElMessage.success('创建成功') }
      dialogVisible.value = false; handleQuery()
    } catch (error) { console.error(error) }
  })
}

onMounted(() => { handleQuery(); (async () => { const r1 = await courseApi.list({ pageSize: 100 }); courses.value = r1.data?.list || []; const r2 = await userApi.list({ role: 'TEACHER', pageSize: 100 }); teachers.value = r2.data?.list || [] })() })
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { margin: 0; }
.search-form { margin-bottom: 20px; }
</style>
