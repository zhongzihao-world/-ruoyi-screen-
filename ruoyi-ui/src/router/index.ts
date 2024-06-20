import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import Layout from '@/layout/index.vue';
import { createRouterGuards } from './router-guards';

export const constantRoutes: any[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/:path(.*)*',
    component: () => import('@/views/error/404.vue'),
    hidden: true,
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    hidden: true,
  },
];

export const dynamicRoutes = [
  {
    path: '/',
    redirect: '/view/list',
    component: Layout,
    meta: {
      title: '大屏管理',
      icon: '404',
    },
    children: [
      {
        path: 'view/list',
        component: () => import('@/views/view/list/index.vue'),
        meta: {
          title: '大屏管理',
          icon: '404',
        },
      },
    ],
  },
  {
    path: '/view/edit/:id(.*)*',
    component: () => import('@/views/view/edit/index.vue'),
    hidden: true,
  },

  {
    path: '/preview/:id(.*)*',
    component: () => import('@/views/view/preview/index.vue'),
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  strict: true,
});

export function setupRouter(app: App) {
  app.use(router);

  // 创建路由守卫
  createRouterGuards(router);
}
export default router;
