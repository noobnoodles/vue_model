<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const loading = ref(false)
const forgetFormRef = ref<FormInstance>()

const forgetForm = reactive({
  username: '',
  email: '',
  newPassword: '',
  confirmPassword: ''
})

const forgetRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== forgetForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const router = useRouter()

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        // TODO: 调用重置密码 API
        ElMessage.success('密码重置成功')
        router.push('/login')
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '密码重置失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const backToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <el-card class="w-[420px] shadow-lg">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-700">重置密码</h2>
        </div>
      </template>
      
      <el-form
        ref="forgetFormRef"
        :model="forgetForm"
        :rules="forgetRules"
        label-position="top"
        class="space-y-4"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="forgetForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            class="h-10"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="forgetForm.email"
            placeholder="请输入邮箱"
            :prefix-icon="Message"
            class="h-10"
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="forgetForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            :prefix-icon="Lock"
            show-password
            class="h-10"
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="forgetForm.confirmPassword"
            type="password"
            placeholder="请确认新密码"
            :prefix-icon="Lock"
            show-password
            class="h-10"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="w-full h-10 text-sm font-medium"
            @click="handleSubmit(forgetFormRef)"
          >
            重置密码
          </el-button>
        </el-form-item>

        <div class="flex justify-center mt-4">
          <el-link type="primary" @click="backToLogin" class="text-sm">
            返回登录
          </el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
