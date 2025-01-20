<script setup lang="ts">
import { User, Lock, Message, Phone } from '@element-plus/icons-vue'
import { useRegister } from '@/function/register'

const {
  loading,
  registerForm,
  registerRules,
  registerFormRef,
  handleRegister,
  backToLogin
} = useRegister()
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <el-card class="w-[420px] shadow-lg">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-700">注册</h2>
        </div>
      </template>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
        class="space-y-4"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            class="h-10"
          />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            :prefix-icon="Message"
            class="h-10"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号"
            :prefix-icon="Phone"
            class="h-10"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            class="h-10"
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
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
            @click="handleRegister(registerFormRef)"
          >
            注册
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

<style scoped>
/* 移除头像相关样式 */
</style>
