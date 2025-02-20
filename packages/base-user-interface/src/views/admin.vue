<script setup lang="ts">
import { useAdmin } from '@/function/admin'

const {
  formRef,
  loading,
  isAuthenticated,
  userList,
  userListLoading,
  loginForm,
  rules,
  verifyAdmin,
  handleToggleStatus,
  handleResetPassword,
} = useAdmin()
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- 管理员验证表单 -->
    <div v-if="!isAuthenticated" class="flex justify-center items-center min-h-screen">
      <el-card class="w-[500px] shadow-lg">
        <template #header>
          <div class="text-center">
            <h2 class="text-xl font-bold text-gray-700">管理员验证</h2>
          </div>
        </template>

        <el-form ref="formRef" :model="loginForm" :rules="rules" label-position="top">
          <el-form-item label="账号" prop="account">
            <el-input v-model="loginForm.account" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="loginForm.phone" placeholder="请输入手机号" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="loginForm.email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="w-full"
              @click="verifyAdmin(formRef)"
            >
              {{ loading ? '验证中...' : '验证' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 用户列表 -->
    <div v-else>
      <el-card class="shadow-lg">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-700">用户管理</h2>
            <el-button type="primary" @click="isAuthenticated = false">重新验证</el-button>
          </div>
        </template>

        <el-table v-loading="userListLoading" :data="userList" style="width: 100%">
          <el-table-column prop="id" label="用户ID" width="180" />
          <el-table-column prop="username" label="用户名" width="180" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
                {{ scope.row.status === 0 ? '正常' : '已封禁' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button
                :type="scope.row.status === 0 ? 'danger' : 'success'"
                size="small"
                @click="handleToggleStatus(scope.row)"
              >
                {{ scope.row.status === 0 ? '封禁' : '解封' }}
              </el-button>
              <el-button type="warning" size="small" @click="handleResetPassword(scope.row)">
                重置密码
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.el-card {
  margin: 20px;
}
</style>
