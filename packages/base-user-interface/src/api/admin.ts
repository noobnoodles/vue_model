import request from '@/utils/request'
import type { IApiResponse } from '@/types/interfaces'

// 定义用户列表项接口
export interface UserItem {
  id: string
  username: string
  email: string
  phone: string
  password: string
  status: 0 | 1 // 0: 正常, 1: 封禁
}

// 管理员登录接口参数类型
interface AdminLoginParams {
  account: string
  password: string
  phone: string
  email: string
  username: string
}

// 管理员登录
export const adminLogin = (data: AdminLoginParams): Promise<IApiResponse<any>> => {
  return request({
    url: '/admin/login',
    method: 'post',
    data,
  })
}

// 获取用户列表，指定返回类型
export const getUserList = (): Promise<IApiResponse<UserItem[]>> => {
  return request({
    url: '/admin/users',
    method: 'get',
  })
}

export const resetPassword = (userId: string): Promise<IApiResponse<void>> => {
  return request({
    url: `/admin/users/${userId}/reset-password`,
    method: 'put',
  })
}

// 更新用户状态
export const updateUserStatus = (userId: string, status: 0 | 1): Promise<IApiResponse<void>> => {
  return request({
    url: `/admin/users/${userId}/status`,
    method: 'put',
    data: { status },
  })
}
