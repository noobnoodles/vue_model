<script setup lang="ts">
import { User, Lock, Upload, Message } from '@element-plus/icons-vue'
import { useRegister } from '@/function/register'

const {
  loading,
  registerForm,
  registerRules,
  registerFormRef,
  handleRegister,
  backToLogin,
  handleAvatarChange,
  avatarUrl
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
        <div class="flex flex-col items-center mb-6">
          <input
            type="file"
            accept="image/*"
            @change="handleAvatarChange"
            class="hidden"
            ref="fileInput"
          />
          <div class="avatar-uploader mb-2" @click="$refs.fileInput.click()">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              class="w-24 h-24 rounded-full object-cover"
            />
            <div v-else class="avatar-uploader-icon">
              <el-icon class="text-4xl">
                <Upload />
              </el-icon>
            </div>
          </div>
          <span class="text-gray-600 text-sm">点击此处上传头像</span>
        </div>

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
.avatar-uploader {
  @apply border border-gray-200 border-dashed rounded-full w-24 h-24 cursor-pointer hover:border-blue-500 flex items-center justify-center transition-colors duration-300;
}

.avatar-uploader-icon {
  @apply w-full h-full flex items-center justify-center;
}
</style>
