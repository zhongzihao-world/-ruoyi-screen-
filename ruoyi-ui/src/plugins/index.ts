import { App } from 'vue';

import tab from './tab';
import auth from './auth';
import cache from './cache';
import modal from './modal';
import download from './download';

export default function installPlugins(app: App<Element>) {
  // 页签操作
  app.config.globalProperties.$tab = tab;
  // 认证对象
  app.config.globalProperties.$auth = auth;
  // 缓存对象
  app.config.globalProperties.$cache = cache;
  // 模态框对象
  app.config.globalProperties.$modal = modal;
  // 下载文件
  app.config.globalProperties.$download = download;
}
