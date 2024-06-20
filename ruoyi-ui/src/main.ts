import { createApp } from 'vue';
import Cookies from 'js-cookie';

import App from './App.vue';
import router, { setupRouter } from '@/router';
import { setupStore } from '@/store';

// element-plus
import ElementPlus, { ConfigProviderProps } from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'; // 中文语言
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
// svg 图标组件
import 'virtual:svg-icons-register';
import SvgIcon from '@/components/SvgIcon/index.vue';
import elementIcons from '@/components/SvgIcon/svgicon';

// 

// 全局css
import '@/assets/styles/index.scss'; // global css
// 引入标尺样式
import 'vue3-sketch-ruler/lib/style.css';

// 全局方法
import plugins from '@/plugins';
// 全局指令
import directive from '@/directive';

// 注册组件
import Pagination from '@/components/Pagination/index.vue';
import RightToolbar from '@/components/RightToolbar/index.vue';

import VueGridLayout from 'vue-grid-layout';

async function appInit() {
  const app = createApp(App);

  // 使用element-plus 并且设置全局的大小
  app.use(ElementPlus, {
    locale: locale,
    size: Cookies.get('size') || 'default',
  } as unknown as ConfigProviderProps);
  app.use(elementIcons);
  app.component('svg-icon', SvgIcon);

  // 注册全局方法、指令
  app.use(plugins);
  app.use(directive);
  app.use(VueGridLayout);

  // 注册组件
  app.component('Pagination', Pagination);
  app.component('RightToolbar', RightToolbar);

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
