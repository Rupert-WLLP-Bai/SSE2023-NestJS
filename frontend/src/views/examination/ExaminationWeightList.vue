<template>
  <div class="page-container">
    <div class="page-header"><h2>考试权重</h2><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增权重</el-button></div>
    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="courseName" label="课程" />
        <el-table-column prop="examinationTitle" label="考试" />
        <el-table-column prop="weight" label="权重(%)" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="课程" prop="courseId"><el-select v-model="form.courseId" placeholder="请选择课程" @change="loadExaminations"><el-option v-for="c in courses" :key="c.id" :label="c.name" :value="c.id" /></el-select></el-form-item>
        <el-form-item label="考试" prop="examinationId"><el-select v-model="form.examinationId" placeholder="请选择考试"><el-option v-for="e in examinations" :key="e.id" :label="e.title" :value="e.id" /></el-select></el-form-item>
        <el-form-item label="权重" prop="weight"><el-input-number v-model="form.weight" :min="0" :max="100" /> %</el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="handleSubmit">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { examinationWeightApi, courseApi, examinationApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const courses = ref<any[]>([])
const examinations = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const form = reactive({ id: '', courseId: '', examinationId: '', weight: 0 })
const rules: FormRules = { courseId: [{ required: true, message: '请选择课程', trigger: 'change' }], examinationId: [{ required: true, message: '请选择考试', trigger: 'change' }] }

const loadData = async () => { loading.value = true; try { const res = await examinationWeightApi.list(); tableData.value = res.data || [] } catch (error) { console.error(error) } finally { loading.value = false } }
const loadCourses = async () => { const res = await courseApi.list({ pageSize: 100 }); courses.value = res.data?.list || [] }
const loadExaminations = async () => { if (form.courseId) { const res = await examinationApi.list({ courseId: form.courseId, pageSize: 100 }); examinations.value = res.data?.list || [] } }
const handleAdd = () => { dialogTitle.value = '新增权重'; Object.assign(form, { id: '', courseId: '', examinationId: '', weight: 0 }); dialogVisible.value = true }
const handleEdit = (row: any) => { dialogTitle.value = '编辑权重'; Object.assign(form, { ...row }); dialogVisible.value = true }
const handleDelete = async (row: any) => { try { await ElMessageBox.confirm('确定要删除吗？', '提示', { type: 'warning' }); await examinationWeightApi.delete(row.id); ElMessage.success('删除成功'); loadData() } catch (error) {} }
const handleSubmit = async () => { if (!formRef.value) return; await formRef.value.validate(async (valid) => { if (!valid) return; try { if (form.id) { await examinationWeightApi.update(form.id, form); ElMessage.success('更新成功') } else { await examinationWeightApi.create(form); ElMessage.success('创建成功') }; dialogVisible.value = false; loadData() } catch (error) { console.error(error) } }) }

onMounted(() => { loadData(); loadCourses() })
</script>

<style scoped>.page-container { padding: 20px; }.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }.page-header h2 { margin: 0; }</style>
