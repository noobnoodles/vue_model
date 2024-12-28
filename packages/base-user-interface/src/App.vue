<script setup lang="ts">
// 不需要导入 login.vue，因为我们使用路由来管理它
</script>

<template>
  <router-view />
</template>

<style>
/* 可以添加全局样式 */
html, body {
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
