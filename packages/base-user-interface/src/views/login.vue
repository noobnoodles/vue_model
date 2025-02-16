<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { useLogin } from '@/function/login'
import { onMounted } from 'vue'
import { TokenUtil } from '@/utils/request';

const {
  systemInfo,
  loading,
  loginForm,
  loginRules,
  loginFormRef,
  loginType,
  verifyCode,
  formErrors,
  fetchSystemTitle,
  switchLoginType,
  sendVerifyCode,
  handleLogin,
  handleRegister,
  handleForgetPassword,
  handleAccountInput
} = useLogin()

// 在组件挂载时获取系统信息
onMounted(() => {
  fetchSystemTitle()
  console.log("token is:",TokenUtil.getToken())
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <el-card class="w-[420px] shadow-lg" :loading="loading">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-700">{{ systemInfo.title || '标题' }}</h2>
        </div>
      </template>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        class="space-y-4"
      >
        <el-form-item 
          label="账号" 
          prop="account"
          :error="formErrors.account"
        >
          <el-input
            v-model="loginForm.account"
            placeholder="请输入账号/手机号/邮箱"
            :prefix-icon="User"
            class="h-10"
            @input="handleAccountInput"
          />
        </el-form-item>
        
        <el-form-item 
          label="密码" 
          prop="password" 
          v-if="loginType === 'password'"
          :error="formErrors.password"
        >
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            class="h-10"
          />
        </el-form-item>

        <el-form-item label="验证码" prop="verifyCode" v-else>
          <div class="flex gap-2">
            <el-input
              v-model="verifyCode"
              placeholder="请输入验证码"
              class="h-10 flex-1"
            />
            <el-button @click="sendVerifyCode" :disabled="!loginForm.account">
              发送验证码
            </el-button>
          </div>
        </el-form-item>
        
        <div class="flex justify-between items-center mb-4">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" @click="switchLoginType" class="text-sm">
            {{ loginType === 'password' ? '手机号登录' : '密码登录' }}
          </el-link>
        </div>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="w-full h-10 text-sm font-medium"
            @click="handleLogin(loginFormRef)"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
        
        <div class="flex justify-between items-center mt-4">
          <el-link type="primary" @click="handleRegister" class="text-sm">注册账号</el-link>
          <el-link type="primary" @click="handleForgetPassword" class="text-sm">忘记密码？</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.el-card.is-loading {
  position: relative;
  overflow: hidden;
}

.el-card.is-loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 2;
}
</style>
