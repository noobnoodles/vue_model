<template>
  <router-view />
</template>

<style>
/* 可以添加全局样式 */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
}
</style>

<script setup lang="ts">
import { useSysInfoStore } from '@/stores/sysInfo'

const sysInfoStore = useSysInfoStore()

// 在应用启动时获取系统信息
onMounted(async () => {
  await sysInfoStore.fetchSystemInfo()
})
</script>
