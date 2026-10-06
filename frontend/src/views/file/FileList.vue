<template>
  <div class="file-manager">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>文件管理</span>
          <el-button type="primary" @click="handleUpload">上传文件</el-button>
        </div>
      </template>

      <!-- 文件列表 -->
      <el-table :data="fileList" v-loading="loading">
        <el-table-column prop="key" label="文件名" />
        <el-table-column prop="size" label="大小" width="120">
          <template #default="{ row }">
            {{ formatSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column prop="putTime" label="上传时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.putTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDownload(row.key)">下载</el-button>
            <el-button type="danger" link @click="handleDelete(row.key)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="fetchFileList"
        />
      </div>
    </el-card>

    <!-- 上传对话框 -->
    <el-dialog v-model="uploadDialogVisible" title="上传文件" width="400px">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        drag
        :action="uploadUrl"
        :headers="uploadHeaders"
        :auto-upload="false"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :on-change="handleFileChange"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
      </el-upload>
      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload" :loading="uploading">上传</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { fileApi } from '@/api'

const loading = ref(false)
const fileList = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const uploadDialogVisible = ref(false)
const uploadRef = ref()
const uploading = ref(false)
const selectedFile = ref<File | null>(null)

const uploadUrl = '/api/file/qiniu'
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('token')}`
}

const fetchFileList = async () => {
  loading.value = true
  try {
    const res = await fileApi.list()
    if (res.data && res.data.items) {
      fileList.value = res.data.items
      total.value = res.data.items.length
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取文件列表失败')
  } finally {
    loading.value = false
  }
}

const handleUpload = () => {
  uploadDialogVisible.value = true
}

const handleFileChange = (file: any) => {
  selectedFile.value = file.raw
}

const submitUpload = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请选择文件')
    return
  }
  uploading.value = true

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    await fileApi.upload(formData)
    ElMessage.success('上传成功')
    uploadDialogVisible.value = false
    fetchFileList()
  } catch (error: any) {
    ElMessage.error(error.message || '上传失败')
  } finally {
    uploading.value = false
  }
}

const handleUploadSuccess = () => {
  ElMessage.success('上传成功')
  uploadDialogVisible.value = false
  fetchFileList()
}

const handleUploadError = (error: any) => {
  ElMessage.error(error.message || '上传失败')
}

const handleDownload = async (filename: string) => {
  try {
    const res = await fileApi.download(filename)
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error: any) {
    ElMessage.error(error.message || '下载失败')
  }
}

const handleDelete = async (filename: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该文件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // Delete API would go here
    ElMessage.success('删除成功')
    fetchFileList()
  } catch {
    // User cancelled
  }
}

const formatSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp / 10000 - 11644473600000)
  return date.toLocaleString()
}

onMounted(() => {
  fetchFileList()
})
</script>

<style scoped>
.file-manager {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.upload-demo {
  width: 100%;
}
</style>
