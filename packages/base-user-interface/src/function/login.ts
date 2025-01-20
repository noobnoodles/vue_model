import { getSystemInfo, login } from '@/api/userService'
import type { IUserLogin } from '@/types/interfaces'
import type { FormInstance, FormRules } from 'element-plus'
import { useSysInfoStore } from '@/stores/sysInfo'

export const useLogin = () => {
  const router = useRouter()
  const loading = ref(false)
  const loginFormRef = ref<FormInstance>()
  const sysInfoStore = useSysInfoStore()

  const loginForm = reactive<IUserLogin>({
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
      
      await sysInfoStore.fetchSystemInfo()
      clearTimeout(timeoutId)
    } catch (error) {
      console.error('获取系统信息失败:', error)
    }
  }

  const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    
    await formEl.validate(async (valid) => {
      if (valid) {
        loading.value = true
        try {
          const { data } = await login(loginForm)
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

  const handleForgetPassword = () => {
    router.push('/forget-password')
  }

  return {
    loading,
    loginForm,
    loginRules,
    loginFormRef,
    systemInfo: computed(() => sysInfoStore.systemInfo), // 导出系统信息的计算属性
    fetchSystemTitle,
    handleLogin,
    handleRegister,
    handleForgetPassword
  }
}
