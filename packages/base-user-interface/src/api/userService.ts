import request from '@/utils/request'
import type { 
  IUserLogin, 
  // IUserRegister, 
  ISystemInfo, 
  IApiResponse,
  IRegisterForm
} from '@/types/interfaces'

export const login = (data: IUserLogin): Promise<IApiResponse> => {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export const getSystemInfo = (): Promise<IApiResponse<ISystemInfo>> => {
  return request({
    url: '/system/info',
    method: 'get'
  })
}

// 用户注册
export function register(data: IRegisterForm) {
  return request<IApiResponse>({
    url: '/register',
    method: 'post',
    data
  })
}

// 检查用户名是否可用
export function checkUsername(username: string, sysBelone: string) {
  return request<IApiResponse<boolean>>({
    url: '/register/check-username',
    method: 'get',
    params: { username, sysBelone }
  })
}

// 检查邮箱是否可用
export function checkEmail(email: string, sysBelone: string) {
  return request<IApiResponse<boolean>>({
    url: '/register/check-email',
    method: 'get',
    params: { email, sysBelone }
  })
} 