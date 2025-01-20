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

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理，比如添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 处理请求错误
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // 根据后端的状态码进行处理
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    // 处理响应错误
    console.error('Response error:', error)
    ElMessage.error(error.response?.data?.message || '请求失败')
    return Promise.reject(error)
  }
)

// 导出request方法
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service(config)
}

export default request 