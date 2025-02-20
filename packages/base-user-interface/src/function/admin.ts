import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  adminLogin,
  getUserList,
  type UserItem,
  updateUserStatus,
  resetPassword,
} from '@/api/admin'

export const useAdmin = () => {
  const formRef = ref<FormInstance>()
  const loading = ref(false)
  const isAuthenticated = ref(false)

  // 用户列表数据
  const userList = ref<UserItem[]>([])
  const userListLoading = ref(false)

  // 登录表单
  const loginForm = reactive({
    account: '',
    password: '',
    phone: '',
    email: '',
    username: '',
  })

  // 登录验证规则
  const rules = reactive<FormRules>({
    userId: [
      { required: true, message: '请输入用户ID', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    ],
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: '请输入正确的邮箱地址',
        trigger: 'blur',
      },
    ],
  })

  // 验证管理员身份
  const verifyAdmin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true
        try {
          const response = await adminLogin(loginForm)
          if (response.code === 200) {
            isAuthenticated.value = true
            await fetchUserList() // 获取用户列表
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || '验证失败，请重试'
          ElMessage.error(errorMessage)
          console.log(loginForm)
        } finally {
          loading.value = false
        }
      }
    })
  }

  // 获取用户列表
  const fetchUserList = async () => {
    userListLoading.value = true
    try {
      const response = await getUserList()
      if (response.code === 200 && response.data) {
        userList.value = response.data
      } else {
        userList.value = [] // 如果没有数据，设置为空数组
      }
    } catch (error: any) {
      ElMessage.error('获取用户列表失败')
      isAuthenticated.value = false
      userList.value = [] // 发生错误时，设置为空数组
    } finally {
      userListLoading.value = false
    }
  }

  // 编辑用户
  const handleEdit = (row: UserItem) => {
    // 实现编辑逻辑
    console.log('编辑用户:', row)
  }

  // 删除用户
  const handleDelete = (row: UserItem) => {
    // 实现删除逻辑
    console.log('删除用户:', row)
  }

  // 重置用户密码
  const handleResetPassword = async (row: UserItem) => {
    try {
      await ElMessageBox.confirm(`确定要重置用户 ${row.username} 的密码吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      const response = await resetPassword(row.id)

      if (response.code === 200) {
        ElMessage.success('密码重置成功，新密码为：123456')
      }
    } catch (error: any) {
      if (error !== 'cancel') {
        ElMessage.error('密码重置失败')
      }
    }
  }

  // 切换用户状态（封禁/解封）
  const handleToggleStatus = async (row: UserItem) => {
    const newStatus = row.status === 0 ? 1 : 0
    const actionText = newStatus === 1 ? '封禁' : '解封'

    try {
      await ElMessageBox.confirm(`确定要${actionText}用户 ${row.username} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      const response = await updateUserStatus(row.id, newStatus)
      if (response.code === 200) {
        ElMessage.success(`${actionText}成功`)
        await fetchUserList() // 刷新列表
      }
    } catch (error: any) {
      if (error !== 'cancel') {
        ElMessage.error(`${actionText}失败`)
      }
    }
  }

  return {
    formRef,
    loading,
    isAuthenticated,
    userList,
    userListLoading,
    loginForm,
    rules,
    verifyAdmin,
    handleEdit,
    handleDelete,
    handleResetPassword,
    handleToggleStatus,
  }
}
