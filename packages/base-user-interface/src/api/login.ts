import request from '@/utils/request'
import type { IUserLogin, IApiResponse } from '@/types/interfaces'

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