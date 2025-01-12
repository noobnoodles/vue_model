// 用户相关接口
export interface IUserLogin {
  username: string
  password: string
  remember: boolean
}

export interface IUserRegister {
  username: string
  password: string
  email: string
  avatar?: string
}

// 系统相关接口
export interface ISystemInfo {
  title: string
  version: string
  // 其他系统信息字段...
}

// 通用响应接口
export interface IApiResponse<T = any> {
  code: number
  data: T
  message: string
} 