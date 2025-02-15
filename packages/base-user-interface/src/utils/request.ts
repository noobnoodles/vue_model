import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 添加一行调试代码
console.log('API URL:', import.meta.env.VITE_API_URL)

// 创建axios实例
const service: AxiosInstance = axios.create({
  // 根据开发环境设置baseURL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// token相关工具函数
export const TokenUtil = {
  getToken: () => localStorage.getItem('token'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (token: string, refreshToken: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
  },
  removeTokens: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expireTime')
  }
}

// 刷新token的函数
const refreshToken = async () => {
  try {
    const response = await service.post('/auth/refresh', {
      refreshToken: TokenUtil.getRefreshToken()
    })
    const { accessToken, refreshToken } = response.data.data
    TokenUtil.setTokens(accessToken, refreshToken)
    return accessToken
  } catch (error) {
    TokenUtil.removeTokens()
    window.location.href = '/login'
    return null
  }
}

// 修改请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = TokenUtil.getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 修改响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (res.code === 200) {
      return res
    }
    
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  async (error) => {
    const originalRequest = error.config
    
    // token过期处理
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newToken = await refreshToken()
      
      if (newToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        return service(originalRequest)
      }
    }
    
    ElMessage.error(error.response?.data?.message || '请求失败')
    return Promise.reject(error)
  }
)

// 导出request方法
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service(config)
}

export default request 