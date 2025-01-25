import request from '@/utils/request'
import type { 
  IUserLogin, 
  // IUserRegister, 
  ISystemInfo, 
  IApiResponse,
  IRegisterForm
} from '@/types/interfaces'

// 密码登录
export const loginByPassword = (data: IUserLogin): Promise<IApiResponse> => {
  return request({
    url: '/login/password',
    method: 'post',
    data
  })
}

// 验证码登录
export const loginByCode = (data: IUserLogin, code: string): Promise<IApiResponse> => {
  return request({
    url: '/login/code',
    method: 'post',
    data,
    params: { code }
  })
}

// 退出登录
export const logout = (token: string): Promise<IApiResponse> => {
  return request({
    url: '/login/logout',
    method: 'post',
    headers: {
      'Authorization': token
    }
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

// 发送重置验证码
export function sendResetCode(email: string) {
  return request<IApiResponse>({
    url: '/forget-password/code',
    method: 'post',
    data: { email }
  })
}

// 验证重置码
export function verifyResetCode(email: string, code: string) {
  return request<IApiResponse<boolean>>({
    url: '/forget-password/verify',
    method: 'get',
    params: { email, code }
  })
}

// 重置密码
export function resetPassword(email: string, newPassword: string, code: string) {
  return request<IApiResponse>({
    url: '/forget-password/reset',
    method: 'post',
    data: { email, newPassword, code }
  })
}

// 修改密码
export function changePassword(email: string, oldPassword: string, newPassword: string) {
  return request<IApiResponse>({
    url: '/forget-password/change',
    method: 'post',
    data: { email, oldPassword, newPassword }
  })
}
