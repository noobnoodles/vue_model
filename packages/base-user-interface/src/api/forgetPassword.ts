import request from '@/utils/request'
import type { IApiResponse } from '@/types/interfaces'

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