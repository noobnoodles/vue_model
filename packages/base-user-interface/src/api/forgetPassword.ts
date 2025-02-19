import request from '@/utils/request'
import type { IApiResponse } from '@/types/interfaces'

// 发送重置验证码
export function sendResetCode(target: string, account: string) {
  return request<IApiResponse>({
    url: '/forget-password/code',
    method: 'post',
    data: { target, account },
  })
}

// 重置密码
export function resetPassword(email: string, newPassword: string, code: string) {
  return request<IApiResponse>({
    url: '/forget-password/reset',
    method: 'post',
    data: { email, newPassword, code },
  })
}

// 修改密码
export function changePassword(
  target: string,
  confirmPassword: string,
  newPassword: string,
  code: string,
) {
  return request<IApiResponse>({
    url: '/forget-password/change',
    method: 'post',
    data: {
      target,
      confirmPassword,
      newPassword,
      code,
    },
  })
}
