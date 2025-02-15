import request from '@/utils/request'
import type { IUserLogin, ILoginResponse } from '@/types/interfaces'

// 密码登录
export const loginByPassword = (data: IUserLogin): Promise<ILoginResponse> => {
  return request({
    url: '/login/password',
    method: 'post',
    data
  })
}

// 验证码登录
export const loginByCode = (data: IUserLogin, code: string): Promise<ILoginResponse> => {
  return request({
    url: '/login/code',
    method: 'post',
    data,
    params: { code }
  }).then(response => {
    // 保存token
    const { accessToken, refreshToken } = response.data.token
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    return response
  })
}

// 退出登录
export const logout = (): Promise<void> => {
  return request({
    url: '/login/logout',
    method: 'post'
  }).finally(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  })
} 