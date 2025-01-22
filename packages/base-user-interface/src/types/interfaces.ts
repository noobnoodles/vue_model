// 用户相关接口
export interface IUserLogin {
  account: string
  password: string
  remember: boolean
  loginType: 1 | 2 | 3  // 1-用户名，2-手机号，3-邮箱
  sysBelone: string     // 所属系统
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
  title: string           // 系统标题
  description: string     // 系统描述
  version: string        // 系统版本
  copyright: string      // 版权信息
  sysBelone: string      // 系统标识
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
  phone: string
  sysBelone: string
}

// 注册响应接口
export interface IRegisterResponse {
  code: number
  message: string
  data?: any
}
