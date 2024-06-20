import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

export const constantRoutes: any[] = [
  {
    path: '/preview/:id(.*)*',
    component: () => import('@/views/view/preview/index.vue'),
  },
];

const router = createRouter({
  history: createWebHistory('/engine'),
  routes: constantRoutes,
  strict: true,
});

export function setupRouter(app: App) {
  app.use(router);
}
export default router;
