<script setup lang="ts">
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useRegister } from '@/function/register'

const {
  loading,
  registerForm,
  registerRules,
  registerFormRef,
  handleRegister,
  backToLogin,
  countdown,
  currentStep,
  handleContinue,
  backToStep1,
  sendingCode,
  handleSendCode,
} = useRegister()
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <el-card class="w-[420px] shadow-lg">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-700">
            {{ currentStep === 1 ? '注册' : '邮箱验证' }}
          </h2>
        </div>
      </template>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
        class="space-y-4"
      >
        <!-- 步骤1：基本信息 -->
        <template v-if="currentStep === 1">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
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
              class="w-full h-10 text-sm font-medium"
              @click="handleContinue(registerFormRef)"
            >
              继续
            </el-button>
          </el-form-item>
        </template>

        <!-- 步骤2：邮箱验证 -->
        <template v-else>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              :prefix-icon="Message"
              class="h-10"
            />
            <el-button
              type="primary"
              link
              class="ml-2 float-right"
              :disabled="!registerForm.email || countdown > 0"
              :loading="sendingCode"
              @click="handleSendCode"
            >
              {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
            </el-button>
          </el-form-item>

          <el-form-item label="验证码" prop="emailCode">
            <el-input
              v-model="registerForm.emailCode"
              placeholder="请输入验证码"
              class="h-10"
              maxlength="6"
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
            <el-button text class="w-full mt-2" @click="backToStep1"> 返回修改 </el-button>
          </el-form-item>
        </template>

        <div class="flex justify-center mt-4">
          <el-link type="primary" @click="backToLogin" class="text-sm"> 返回登录 </el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
/* 移除头像相关样式 */
</style>
