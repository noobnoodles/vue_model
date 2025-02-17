import request from '@/utils/request'
import type { IApiResponse, IRegisterForm } from '@/types/interfaces'

// 用户注册
export function register(data: IRegisterForm) {
  return request<IApiResponse>({
    url: '/register',
    method: 'post',
    data,
  })
}

// 检查用户名是否可用
export function checkUsername(username: string, sysBelone: string) {
  return request<IApiResponse<boolean>>({
    url: '/register/check-username',
    method: 'get',
    params: { username, sysBelone },
  })
}

// 发送注册验证码
export function sendRegisterCode(email: string, sysBelone: string) {
  return request<IApiResponse>({
    url: '/register/send-email-code',
    method: 'post',
    params: {
      email,
      sysBelone,
    },
  })
}
