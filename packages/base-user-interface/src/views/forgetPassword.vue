<script setup lang="ts">
import { Message, Lock } from '@element-plus/icons-vue'
import { useForgetPassword } from '@/function/forgetPassword'

const {
    loading,
    forgetForm,
    forgetRules,
    forgetFormRef,
    handleSubmit,
    backToLogin,
    sendCode
} = useForgetPassword()
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
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="forgetForm.email"
            placeholder="请输入邮箱"
            :prefix-icon="Message"
            class="h-10"
          />
          <el-link
            type="primary"
            class="ml-2 float-right"
            :disabled="!forgetForm.email"
            @click="sendCode"
          >
            发送验证码
          </el-link>
        </el-form-item>

        <el-form-item label="验证码" prop="code">
          <el-input
            v-model="forgetForm.code"
            placeholder="请输入验证码"
            class="h-10"
            maxlength="6"
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
