<script setup lang="ts">
import { onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useLogin } from '@/function/login'
// 页面构建和功能分离
// 使用function导入login前端功能函数

const {
  title,
  loading,
  loginForm,
  loginRules,
  loginFormRef,
  fetchSystemTitle,
  handleLogin,
  handleRegister
} = useLogin()
//定义登录信息
onMounted(() => {
  fetchSystemTitle()
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <el-card class="w-[420px] shadow-lg">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-700">{{ title }}</h2>
        </div>
      </template>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        class="space-y-4"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            class="h-10"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            class="h-10"
          />
        </el-form-item>
        
        <el-form-item>
          <div class="flex items-center justify-between">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="w-full h-10 text-sm font-medium"
            @click="handleLogin(loginFormRef)"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="flex justify-between items-center mt-4">
          <el-link type="primary" @click="handleRegister" class="text-sm">注册账号</el-link>
          <el-link type="primary" class="text-sm">忘记密码？</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
