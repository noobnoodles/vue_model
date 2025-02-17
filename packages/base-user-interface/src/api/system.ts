import request from '@/utils/request'
import type { IApiResponse, ISystemInfo } from '@/types/interfaces'

export const getSystemInfo = (): Promise<IApiResponse<ISystemInfo>> => {
  return request({
    url: '/system/info',
    method: 'get',
  })
}
