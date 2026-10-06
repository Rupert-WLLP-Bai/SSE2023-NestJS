<template>
  <div class="audit-log">
    <el-card>
      <template #header>
        <span>审计日志</span>
      </template>
      <el-table :data="auditList" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="action" label="操作" width="150" />
        <el-table-column prop="targetType" label="目标类型" width="150" />
        <el-table-column prop="targetId" label="目标ID" width="100" />
        <el-table-column prop="ipAddress" label="IP地址" width="150" />
        <el-table-column prop="createTime" label="时间">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="fetchAuditLog"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { auditApi } from '@/api'

const loading = ref(false)
const auditList = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchAuditLog = async () => {
  loading.value = true
  try {
    const res = await auditApi.list({ page: currentPage.value, pageSize: pageSize.value })
    if (res.data) {
      auditList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取审计日志失败')
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

onMounted(() => {
  fetchAuditLog()
})
</script>

<style scoped>
.audit-log {
  padding: 20px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
