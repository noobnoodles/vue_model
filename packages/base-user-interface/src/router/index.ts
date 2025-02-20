import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { TokenUtil } from '@/utils/tokenUtil'

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
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin.vue'),
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

// 添加全局前置守卫（只处理需要普通用户token的路由）
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = TokenUtil.getToken()
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
