import { defineAsyncComponent, AsyncComponentLoader } from 'vue';
import * as NProgress from 'nprogress';
import { ElMessage } from 'element-plus';

import AsyncLoading from '@/components/AsyncLoading/index.vue';

/**
 * * 动态注册组件
 */
export const componentInstall = <T>(key: string, node: T) => {
  if (!window['$vue'].component(key) && node) {
    window['$vue'].component(key, node);
  }
};

/**
 * * 异步加载组件
 * @param loader
 * @returns
 */
export const loadAsyncComponent = (loader: AsyncComponentLoader<any>) =>
  defineAsyncComponent({
    loader,
    loadingComponent: AsyncLoading,
    delay: 20,
  });

// 加载开始
export const loadingStart = () => {
  NProgress.start();
};
// 加载结束
export const loadingFinish = () => {
  setTimeout(() => {
    NProgress.done();
  });
};
// 加载错误
export const loadingError = (error = '组件加载异常') => {
  setTimeout(() => {
    NProgress.done();
    ElMessage.error(error);
  });
};
