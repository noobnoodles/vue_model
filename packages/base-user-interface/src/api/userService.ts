import axios from 'axios'
import { API_BASE_URL } from '@/config/api'
import type { 
  IUserLogin, 
  IUserRegister, 
  ISystemInfo, 
  IApiResponse 
} from '@/types/interfaces'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const login = (data: IUserLogin): Promise<IApiResponse> => {
  return api.post('/api/login', data)
}

export const register = (data: IUserRegister): Promise<IApiResponse> => {
  return api.post('/api/register', data)
}

export const getSystemInfo = (): Promise<IApiResponse<ISystemInfo>> => {
  return api.get('/api/system/info')
} 