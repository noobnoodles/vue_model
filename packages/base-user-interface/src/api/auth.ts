import axios from 'axios'
import { API_BASE_URL } from '@/config/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface LoginParams {
  username: string
  password: string
  remember: boolean
}

export const login = (data: LoginParams) => {
  return api.post('/api/login', data)
}

export const getSystemInfo = () => {
  return api.get('/api/system/info')
} 