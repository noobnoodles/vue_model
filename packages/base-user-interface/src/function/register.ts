import { register, sendRegisterCode } from '@/api'
import type { IRegisterForm } from '@/types/interfaces'
import type { FormInstance, FormRules } from 'element-plus'
import { useSysInfoStore } from '@/stores/sysInfo'
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export function useRegister() {
    const router = useRouter()
    const loading = ref(false)
    const registerFormRef = ref<FormInstance>()
    const sysInfoStore = useSysInfoStore()
    
    const countdown = ref(0)
    const timer = ref<NodeJS.Timeout | null>(null)
    const currentStep = ref(1) // 1: 基本信息, 2: 邮箱验证
    const sendingCode = ref(false) // 发送验证码的加载状态
    
    const registerForm = ref<IRegisterForm>({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        emailCode: '',
        sysBelone: sysInfoStore.systemInfo.sysBelone || 'AUTH_SYSTEM'
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
        emailCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { len: 6, message: '验证码长度应为6位', trigger: 'blur' }
        ]
    })

    const sendCode = async () => {
        if (countdown.value > 0) return
        
        try {
            // 验证邮箱格式
            if (!registerForm.value.email) {
                ElMessage.warning('请输入邮箱')
                return
            }

            // 使用正则表达式验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(registerForm.value.email)) {
                ElMessage.warning('请输入正确的邮箱地址')
                return
            }

            // 调用发送验证码接口
            await sendRegisterCode(
                registerForm.value.email,
                registerForm.value.sysBelone
            )
            
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
            ElMessage.error(error.response?.data?.message || '发送验证码失败')
        }
    }

    const handleRegister = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        
        await formEl.validate(async (valid: boolean) => {
            if (valid) {
                loading.value = true
                try {
                    // 发送注册请求，包含验证码和确认密码
                    await register({
                        username: registerForm.value.username,
                        password: registerForm.value.password,
                        confirmPassword: registerForm.value.confirmPassword,
                        email: registerForm.value.email,
                        emailCode: registerForm.value.emailCode,
                        sysBelone: registerForm.value.sysBelone
                    })
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

    const handleContinue = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        
        await formEl.validate(async (valid: boolean) => {
            if (valid) {
                currentStep.value = 2
            }
        })
    }

    const handleSendCode = async () => {
        if (sendingCode.value) return
        sendingCode.value = true
        try {
            await sendCode()
        } finally {
            sendingCode.value = false
        }
    }

    const backToStep1 = () => {
        currentStep.value = 1
    }

    onUnmounted(() => {
        if (timer.value) {
            clearInterval(timer.value)
            timer.value = null
        }
    })

    return {
        loading,
        registerForm,
        registerRules,
        registerFormRef,
        handleRegister,
        backToLogin,
        countdown,
        currentStep,
        handleContinue,
        backToStep1,
        sendingCode,
        handleSendCode
    }
} 