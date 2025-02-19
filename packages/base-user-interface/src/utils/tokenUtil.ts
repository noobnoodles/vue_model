import { refreshTokenApi } from '@/api/token'

// Token相关工具函数
export const TokenUtil = {
  // 获取token
  getToken: () => localStorage.getItem('token'),

  // 获取refreshToken
  getRefreshToken: () => localStorage.getItem('refreshToken'),

  // 设置token
  setTokens: (token: string, refreshToken: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
  },

  // 移除token
  removeTokens: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expireTime')
  },

  // 刷新token
  refreshToken: async () => {
    try {
      const response = await refreshTokenApi(TokenUtil.getRefreshToken() || '')
      if (response.data) {
        const { token, refreshToken: newRefreshToken } = response.data
        TokenUtil.setTokens(token, newRefreshToken)
        return token
      }
      throw new Error('Token refresh failed: No data received')
    } catch (error) {
      TokenUtil.removeTokens()
      window.location.href = '/login'
      return null
    }
  },
}
