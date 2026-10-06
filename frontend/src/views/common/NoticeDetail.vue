<template>
  <div class="notice-detail">
    <el-card v-loading="loading">
      <template #header>
        <div class="header">
          <el-button @click="$router.back()"><el-icon><ArrowLeft /></el-icon>返回</el-button>
        </div>
      </template>
      <h1 class="title">{{ notice.title }}</h1>
      <div class="meta">
        <span>发布人：{{ notice.authorName }}</span>
        <span>发布时间：{{ notice.createdAt }}</span>
      </div>
      <el-divider />
      <div class="content">{{ notice.content }}</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { noticeApi } from '@/api'

const route = useRoute()
const loading = ref(false)
const notice = reactive({ id: '', title: '', content: '', authorName: '', createdAt: '' })

const loadNotice = async () => {
  loading.value = true
  try {
    const res = await noticeApi.get(route.params.id as string)
    Object.assign(notice, res.data)
  } catch (error) { console.error(error) }
  finally { loading.value = false }
}

onMounted(() => { loadNotice() })
</script>

<style scoped>
.notice-detail { padding: 20px; max-width: 900px; margin: 0 auto; }
.header { display: flex; align-items: center; }
.title { text-align: center; margin: 20px 0; font-size: 24px; }
.meta { text-align: center; color: #999; font-size: 14px; display: flex; gap: 20px; justify-content: center; }
.content { line-height: 2; font-size: 16px; white-space: pre-wrap; }
</style>
