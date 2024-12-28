import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { login, getSystemInfo } from '@/api/auth'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export const useLogin = () => {
  const router = useRouter()
  const title = ref('标题')
  const loading = ref(false)
  const loginFormRef = ref<FormInstance>()

  const loginForm = reactive({
    username: '',
    password: '',
    remember: false
  })

  const loginRules = reactive<FormRules>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ]
  })

  // 获取系统标题
  const fetchSystemTitle = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 500)
      
      const res = await getSystemInfo()
      clearTimeout(timeoutId)
      title.value = res.data.title || '标题'
    } catch (error) {
      title.value = '标题'
    }
  }

  const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    
    await formEl.validate(async (valid) => {
      if (valid) {
        loading.value = true
        try {
          const res = await login(loginForm)
          ElMessage.success('登录成功')
          router.push('/')
        } catch (error: any) {
          ElMessage.error(error.response?.data?.message || '登录失败')
        } finally {
          loading.value = false
        }
      }
    })
  }

  const handleRegister = () => {
    router.push('/register')
  }

  return {
    title,
    loading,
    loginForm,
    loginRules,
    loginFormRef,
    fetchSystemTitle,
    handleLogin,
    handleRegister
  }
}
