import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

export function useForgetPassword() {
    const router = useRouter()
    const loading = ref(false)
    const forgetFormRef = ref<FormInstance>()

    const forgetForm = reactive({
        username: '',
        email: '',
        newPassword: '',
        confirmPassword: ''
    })

    const forgetRules = reactive<FormRules>({
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
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
                trigger: 'blur'
            }
        ]
    })

    const handleSubmit = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        
        await formEl.validate(async (valid: boolean) => {
            if (valid) {
                loading.value = true
                try {
                    // TODO: 调用重置密码 API
                    ElMessage.success('密码重置成功')
                    router.push('/login')
                } catch (error: any) {
                    ElMessage.error(error.response?.data?.message || '密码重置失败')
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
        forgetForm,
        forgetRules,
        forgetFormRef,
        handleSubmit,
        backToLogin
    }
}
