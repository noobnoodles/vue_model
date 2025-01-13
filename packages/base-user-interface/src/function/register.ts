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
  const fileInput = ref<HTMLInputElement | null>(null)
  
  const registerForm = ref<IRegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: ''
  })

  const registerRules = reactive<FormRules>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
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
    ]
  })

  // Handle avatar change
  const handleAvatarChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      avatarUrl.value = URL.createObjectURL(file)
      registerForm.value.avatar = file
    }
  }

  // Handle registration
  const handleRegister = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    
    await formEl.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true
        try {
          const formData = new FormData()
          formData.append('username', registerForm.value.username)
          formData.append('password', registerForm.value.password)
          if (registerForm.value.avatar) {
            formData.append('avatar', registerForm.value.avatar)
          }
          
          const response = await register(formData)
          
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
    handleAvatarChange,
    avatarUrl,
    fileInput
  }
} 