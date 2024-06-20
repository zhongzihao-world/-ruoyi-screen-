import { createApp } from 'vue';

import 'element-plus/dist/index.css';

import App from './App.vue';
import router, { setupRouter } from './router/index';
import { setupStore } from '@/store';

async function appInit() {
  const app = createApp(App);

  // pinia router
  setupStore(app);
  setupRouter(app);

  // 挂载 vue 实例
  await router.isReady();
  app.mount('#app', true);
  window['$vue'] = app;
}

appInit().then(() => {
  // 捕获全局错误
  window.addEventListener('unhandledrejection', event => {
    console.warn(`unhandledrejection: ${event.reason}`);
  });
});
