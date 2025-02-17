import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useSysInfoStore } from '@/stores/sysInfo'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register.vue'),
  },
  {
    path: '/forget-password',
    name: 'forgetPassword',
    component: () => import('../views/forgetPassword.vue'),
  },
  {
    path: '/',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const sysInfoStore = useSysInfoStore()

  // 如果系统信息未加载，则加载系统信息
  if (!sysInfoStore.systemInfo.title) {
    await sysInfoStore.fetchSystemInfo()
  }

  next()
})

export default router
