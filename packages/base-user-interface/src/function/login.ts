import { loginByPassword, verifyToken } from '@/api/index'
import type { IUserLogin, ILoginResponse } from '@/types/interfaces'
import type { FormInstance, FormRules } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { TokenUtil } from '@/utils/tokenUtil'

export const useLogin = () => {
  const router = useRouter()
  const loading = ref(false)
  const loginFormRef = ref<FormInstance>()

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
          } else if (
            accountType.value === 3 &&
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ) {
            callback(new Error('请输入正确的邮箱'))
          } else if (accountType.value === 1 && (value.length < 3 || value.length > 20)) {
            callback(new Error('用户名长度在 3 到 20 个字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
      },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    ],
  })

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

  // 添加表单错误状态
  const formErrors = reactive({
    account: '',
    password: '',
  })

  const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    // 清除之前的错误信息
    formErrors.account = ''
    formErrors.password = ''

    await formEl.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true
        try {
          const response = (await loginByPassword({
            account: loginForm.account,
            password: loginForm.password,
            remember: loginForm.remember,
            loginType: loginForm.loginType,
          })) as ILoginResponse

          if (response.code === 200 && response.data) {
            const { token, refreshToken, expireTime } = response.data

            if (token && refreshToken && expireTime) {
              TokenUtil.setTokens(token, refreshToken)
              localStorage.setItem('expireTime', expireTime.toString())
              ElMessage.success('登录成功')
              router.push('/')
            } else {
              throw new Error('Token数据不完整')
            }
          } else {
            throw new Error(response.message || '登录失败')
          }
        } catch (error: any) {
          console.error('登录错误:', error)

          const errorStatus = error.response?.status || error.response?.code

          // 处理业务错误
          if (errorStatus === 400) {
            // 所有400错误都显示在两个输入框下
            formErrors.account = '账号或密码错误'
            formErrors.password = '账号或密码错误'
          } else {
            // 系统错误使用 ElMessage
            ElMessage.error('系统错误，请稍后重试')
          }
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

  // 修改token检查函数
  const checkExistingToken = async () => {
    console.log('Checking existing token...')
    const token = TokenUtil.getToken()
    if (!token) return

    try {
      const response = await verifyToken(token)
      if (response.code === 200) {
        // token 有效，显示确认对话框
        ElMessageBox.confirm('检测到您已登录，是否直接进入系统？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '重新登录',
          type: 'info',
        })
          .then(() => {
            // 用户点击确定，直接跳转
            router.push('/')
          })
          .catch(() => {
            // 用户点击取消或关闭，清除token
            TokenUtil.removeTokens()
          })
      }
    } catch (error: any) {
      const errorStatus = error.response?.status || error.response?.code

      if (errorStatus === 401) {
        // token 已过期，清除本地存储
        TokenUtil.removeTokens()
        ElMessage.warning('登录信息已过期，请重新登录')
      } else {
        // 其他错误不做处理
        console.error('Token验证错误:', error)
      }
    }
  }

  // 在组件挂载时检查token
  onMounted(async () => {
    await checkExistingToken()
  })

  return {
    loading,
    loginForm,
    loginRules,
    loginFormRef,
    loginType,
    verifyCode,
    accountType,
    switchLoginType,
    sendVerifyCode,
    handleAccountInput,
    formErrors,
    handleLogin,
    handleRegister,
    handleForgetPassword,
  }
}
