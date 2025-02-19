import request from '@/utils/request'
import type { IApiResponse, ITokenResponse } from '@/types/interfaces'

// 刷新token
export const refreshTokenApi = (refreshToken: string): Promise<IApiResponse<ITokenResponse>> => {
  return request({
    url: '/auth/refresh',
    method: 'post',
    data: {
      refreshToken,
    },
  })
}
