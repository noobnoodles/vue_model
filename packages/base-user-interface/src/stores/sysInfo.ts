import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getSystemInfo } from '@/api/userService'
import type { ISystemInfo } from '@/types/interfaces'

export const useSysInfoStore = defineStore('sysInfo', () => {
  // 系统信息
  const systemInfo = ref<ISystemInfo>({
    title: '',
    description: '',
    version: '',
    copyright: '',
    sysBelone: ''
  })

  // 获取系统信息
  const fetchSystemInfo = async () => {
    try {
      const response = await getSystemInfo()
      if (response.code === 200 && response.data) {
        systemInfo.value = response.data
      }
    } catch (error) {
      console.error('获取系统信息失败:', error)
    }
  }

  return {
    systemInfo,
    fetchSystemInfo
  }
})
