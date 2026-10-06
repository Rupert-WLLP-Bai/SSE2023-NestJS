<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon class="stat-icon" :size="40" color="#409EFF">
              <User />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">1,234</div>
              <div class="stat-label">学生总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon class="stat-icon" :size="40" color="#67C23A">
              <Document />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">56</div>
              <div class="stat-label">课程总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon class="stat-icon" :size="40" color="#E6A23C">
              <EditPen />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">28</div>
              <div class="stat-label">考试总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon class="stat-icon" :size="40" color="#F56C6C">
              <Cpu />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">128</div>
              <div class="stat-label">实验总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近公告</span>
              <el-button type="primary" link @click="$router.push('/common/notice')">查看更多</el-button>
            </div>
          </template>
          <el-table :data="notices" style="width: 100%">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="createdAt" label="发布时间" width="180" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>成绩分布</span>
            </div>
          </template>
          <v-chart :option="chartOption" style="height: 300px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { User, Document, EditPen, Cpu } from '@element-plus/icons-vue'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent])

const notices = ref([
  { title: '关于期末考试安排的通知', createdAt: '2024-01-15' },
  { title: '实验报告提交截止日期提醒', createdAt: '2024-01-14' },
  { title: '课程表调整通知', createdAt: '2024-01-13' }
])

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['0-60', '60-70', '70-80', '80-90', '90-100']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '人数',
      type: 'bar',
      data: [45, 120, 280, 350, 180],
      itemStyle: {
        color: '#409EFF'
      }
    }
  ]
}))
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
