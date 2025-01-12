import { register } from '@/api/userService'
import type { IUserRegister } from '@/types/interfaces'

interface IRegisterForm extends IUserRegister {
  confirmPassword: string
  avatar?: string
}

export function useRegister() {
  const router = useRouter()
  const loading = ref(false)
  const registerFormRef = ref<FormInstance>()
  const avatarUrl = ref('')
  
  const registerForm = ref<IRegisterForm>({
    username: '',
    password: '',
    confirmPassword: '',
    avatar: ''
  })

  const registerRules = reactive<FormRules>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      {
        validator: (rule: any, value: string, callback: Function) => {
          if (value !== registerForm.value.password) {
            callback(new Error('两次输入密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    email: [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  })

  // 头像上传前的验证
  const beforeAvatarUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
      ElMessage.error('头像只能是 JPG/PNG 格式!')
    }
    if (!isLt2M) {
      ElMessage.error('头像大小不能超过 2MB!')
    }
    return isJPG && isLt2M
  }

  // 头像上传成功的回调
  const handleAvatarSuccess = (response: any) => {
    if (response.code === 200) {
      avatarUrl.value = response.data.url
      registerForm.value.avatar = response.data.url
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error('头像上传失败')
    }
  }

  // 处理注册
  const handleRegister = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    
    await formEl.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true
        try {
          const params: IUserRegister = {
            username: registerForm.value.username,
            password: registerForm.value.password,
            email: registerForm.value.email
          }
          
          const response = await register(params)
          
          if (response.data.code === 200) {
            ElMessage.success('注册成功')
            router.push('/login')
          } else {
            ElMessage.error(response.data.message || '注册失败')
          }
        } catch (error: any) {
          ElMessage.error(error.response?.data?.message || '注册失败')
        } finally {
          loading.value = false
        }
      }
    })
  }

  // 返回登录页
  const backToLogin = () => {
    router.push('/login')
  }

  return {
    loading,
    registerForm,
    registerRules,
    registerFormRef,
    handleRegister,
    backToLogin,
    handleAvatarSuccess,
    beforeAvatarUpload,
    avatarUrl
  }
} 