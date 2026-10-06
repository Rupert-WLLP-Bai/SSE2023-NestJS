<template>
  <div class="page-container">
    <div class="page-header">
      <h2>公告管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>发布公告
      </el-button>
    </div>

    <el-card>
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="queryForm.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="authorName" label="发布人" width="100" />
        <el-table-column prop="createdAt" label="发布时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
        :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleQuery" @current-change="handleQuery" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="6" />
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { noticeApi } from '@/api'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

const queryForm = reactive({ title: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const form = reactive({ id: '', title: '', content: '' })
const rules: FormRules = { title: [{ required: true, message: '请输入标题', trigger: 'blur' }], content: [{ required: true, message: '请输入内容', trigger: 'blur' }] }

const handleQuery = async () => {
  loading.value = true
  try {
    const res = await noticeApi.list({ page: pagination.page, pageSize: pagination.pageSize, ...queryForm })
    tableData.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) { console.error(error) }
  finally { loading.value = false }
}
const handleReset = () => { queryForm.title = ''; handleQuery() }
const handleAdd = () => { dialogTitle.value = '发布公告'; Object.assign(form, { id: '', title: '', content: '' }); dialogVisible.value = true }
const handleView = (row: any) => { router.push(`/common/notice/${row.id}`) }
const handleEdit = (row: any) => { dialogTitle.value = '编辑公告'; Object.assign(form, { ...row }); dialogVisible.value = true }
const handleDelete = async (row: any) => {
  try { await ElMessageBox.confirm('确定要删除该公告吗？', '提示', { type: 'warning' }); await noticeApi.delete(row.id); ElMessage.success('删除成功'); handleQuery() } catch (error) {}
}
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (form.id) { await noticeApi.update(form.id, form); ElMessage.success('更新成功') }
      else { await noticeApi.create(form); ElMessage.success('创建成功') }
      dialogVisible.value = false; handleQuery()
    } catch (error) { console.error(error) }
  })
}

onMounted(() => { handleQuery() })
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { margin: 0; }
.search-form { margin-bottom: 20px; }
</style>
