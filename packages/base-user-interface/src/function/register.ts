import { register } from '@/api/userService'
import type { IRegisterForm } from '@/types/interfaces'
import type { FormInstance, FormRules } from 'element-plus'

export function useRegister() {
    const router = useRouter()
    const loading = ref(false)
    const registerFormRef = ref<FormInstance>()
    
    const registerForm = ref<IRegisterForm>({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        sysBelone: 'base-ui' // 默认系统标识
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
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
    })

    const handleRegister = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        
        await formEl.validate(async (valid: boolean) => {
            if (valid) {
                loading.value = true
                try {
                    await register(registerForm.value)
                    ElMessage.success('注册成功')
                    router.push('/login')
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
        backToLogin
    }
} 