import { loginByPassword, loginByCode, getSystemInfo } from '@/api/userService'
import type { IUserLogin } from '@/types/interfaces'
import type { FormInstance, FormRules } from 'element-plus'
import { useSysInfoStore } from '@/stores/sysInfo'

export const useLogin = () => {
  const router = useRouter()
  const loading = ref(false)
  const loginFormRef = ref<FormInstance>()
  const sysInfoStore = useSysInfoStore()
  
  // 登录方式：password-密码登录，code-验证码登录
  const loginType = ref<'password' | 'code'>('password')
  // 验证码
  const verifyCode = ref('')
  // 登录账号类型：1-用户名，2-手机号，3-邮箱
  const accountType = ref<1 | 2 | 3>(1)

  const loginForm = reactive({
    account: '',
    password: '',
    remember: false,
    loginType: 1, // 默认使用用户名登录
    sysBelone: sysInfoStore.systemInfo.sysBelone || 'AUTH_SYSTEM'
  }) as IUserLogin

  // 自动判断输入的账号类型
  const handleAccountInput = (value: string) => {
    if (/^1[3-9]\d{9}$/.test(value)) {
      // 手机号格式
      loginForm.loginType = 2
      accountType.value = 2
    } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      // 邮箱格式
      loginForm.loginType = 3
      accountType.value = 3
    } else {
      // 用户名格式
      loginForm.loginType = 1
      accountType.value = 1
    }
  }

  const loginRules = reactive<FormRules>({
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { 
        validator: (rule: any, value: string, callback: Function) => {
          if (accountType.value === 2 && !/^1[3-9]\d{9}$/.test(value)) {
            callback(new Error('请输入正确的手机号'))
          } else if (accountType.value === 3 && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            callback(new Error('请输入正确的邮箱'))
          } else if (accountType.value === 1 && (value.length < 3 || value.length > 20)) {
            callback(new Error('用户名长度在 3 到 20 个字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
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

  // 切换登录方式
  const switchLoginType = () => {
    loginType.value = loginType.value === 'password' ? 'code' : 'password'
  }

  // 发送验证码
  const sendVerifyCode = async () => {
    if (!loginForm.account) {
      ElMessage.warning('请先输入账号')
      return
    }
    // TODO: 调用发送验证码接口
    ElMessage.success('验证码已发送')
  }

  const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    
    await formEl.validate(async (valid) => {
      if (valid) {
        // 输出登录信息
        console.log('登录信息:', {
          account: loginForm.account,
          loginType: loginForm.loginType,
          sysBelone: loginForm.sysBelone,
          method: loginType.value // 密码登录还是验证码登录
        })

        loading.value = true
        try {
          let response
          if (loginType.value === 'password') {
            response = await loginByPassword(loginForm)
          } else {
            if (!verifyCode.value) {
              ElMessage.warning('请输入验证码')
              return
            }
            response = await loginByCode(loginForm, verifyCode.value)
          }
          
          if (response.code === 200) {
            ElMessage.success('登录成功')
            if (loginForm.remember) {
              localStorage.setItem('token', response.data.token)
            }
            router.push('/')
          }
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
    loginType,
    verifyCode,
    accountType,
    systemInfo: computed(() => sysInfoStore.systemInfo),
    fetchSystemTitle,
    switchLoginType,
    sendVerifyCode,
    handleAccountInput,
    handleLogin,
    handleRegister,
    handleForgetPassword
  }
}
