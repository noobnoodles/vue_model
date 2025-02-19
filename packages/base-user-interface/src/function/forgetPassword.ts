import { ref, reactive, onUnmounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { sendResetCode, changePassword } from '@/api'

export function useForgetPassword() {
  const router = useRouter()
  const loading = ref(false)
  const forgetFormRef = ref<FormInstance>()
  const countdown = ref(0)
  const timer = ref<NodeJS.Timeout | null>(null)
  const resetSuccess = ref(false)

  const forgetForm = reactive({
    account: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  })

  const forgetRules = reactive<FormRules>({
    account: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
    ],
    code: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { len: 6, message: '验证码长度为6位', trigger: 'blur' },
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
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
        trigger: 'blur',
      },
    ],
  })

  const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true
        try {
          // 打印表单数据
          console.log('提交的表单数据:', {
            account: forgetForm.account,
            confirmPassword: forgetForm.confirmPassword,
            newPassword: forgetForm.newPassword,
            code: forgetForm.code,
          })

          await changePassword(
            forgetForm.account,
            forgetForm.confirmPassword,
            forgetForm.newPassword,
            forgetForm.code,
          )
          ElMessage.success('密码重置成功')
          resetSuccess.value = true
        } catch (error: any) {
          console.error('提交失败:', error) // 添加错误日志
          ElMessage.error(error.response?.data?.message || '密码重置失败')
        } finally {
          loading.value = false
        }
      }
    })
  }

  const sendCode = async () => {
    if (countdown.value > 0) return

    try {
      // 验证邮箱格式
      if (!forgetForm.account) {
        ElMessage.warning('请输入邮箱')
        return
      }

      // 使用正则表达式验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(forgetForm.account)) {
        ElMessage.warning('请输入正确的邮箱地址')
        return
      }

      // 调用发送验证码接口，添加系统标识
      await sendResetCode(forgetForm.account, forgetForm.account)

      ElMessage.success('验证码已发送，请查收邮件')
      countdown.value = 60
      timer.value = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          if (timer.value) {
            clearInterval(timer.value)
            timer.value = null
          }
        }
      }, 1000)
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '验证码发送失败')
    }
  }

  // 组件卸载时清理定时器
  onUnmounted(() => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  })

  const backToLogin = () => {
    router.push('/login')
  }

  return {
    loading,
    forgetForm,
    forgetRules,
    forgetFormRef,
    handleSubmit,
    backToLogin,
    sendCode,
    countdown,
    resetSuccess,
  }
}
