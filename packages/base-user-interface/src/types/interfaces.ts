// 用户相关接口
export interface IUserLogin {
  account: string
  password: string
  remember: boolean
  loginType: 1 | 2 | 3 // 1-用户名，2-手机号，3-邮箱
  sysBelone: string // 所属系统
}

export interface IUserRegister {
  username: string
  password: string
  email: string
  avatar?: string
}

// 系统相关接口
export interface ISystemInfo {
  // 系统基本信息
  title: string // 系统标题
  description: string // 系统描述
  version: string // 系统版本
  copyright: string // 版权信息
  sysBelone: string // 系统标识
}

// 通用响应接口
export interface IApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

// 与后端RegisterDTO保持一致
export interface IRegisterForm {
  username: string
  password: string
  confirmPassword: string
  email: string
  emailCode: string // 改为 emailCode 以匹配后端
  sysBelone: string
}

// 注册响应接口
export interface IRegisterResponse {
  code: number
  message: string
  data?: any
}

// Token相关接口
export interface ITokenResponse {
  token: string // 对应后端的token字段
  refreshToken: string // 对应后端的refreshToken字段
  expireTime: number // 对应后端的expireTime字段 (Long)
}

// 登录响应接口
export interface ILoginResponse {
  code: number
  message: string
  data: {
    id: string
    username: string
    avatar: string | null
    token: string
    refreshToken: string
    expireTime: number
  }
}
