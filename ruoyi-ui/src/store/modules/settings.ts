import { defineStore } from 'pinia';

import defaultSettings from '@/settings';
import { useDynamicTitle } from '@/utils/dynamicTitle';

const {
  color,
  sideTheme,
  showSettings,
  topNav,
  tagsView,
  fixedHeader,
  sidebarLogo,
  dynamicTitle,
} = defaultSettings;

const storageSetting = JSON.parse(localStorage.getItem('layout-setting') || '{}');

const useSettingsStore = defineStore('settings', {
  state: () => ({
    title: '',
    theme: storageSetting.theme || color,
    sideTheme: storageSetting.sideTheme || sideTheme,
    showSettings: showSettings,
    topNav:
      storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
    tagsView:
      storageSetting.tagsView === undefined
        ? tagsView
        : storageSetting.tagsView,
    fixedHeader:
      storageSetting.fixedHeader === undefined
        ? fixedHeader
        : storageSetting.fixedHeader,
    sidebarLogo:
      storageSetting.sidebarLogo === undefined
        ? sidebarLogo
        : storageSetting.sidebarLogo,
    dynamicTitle:
      storageSetting.dynamicTitle === undefined
        ? dynamicTitle
        : storageSetting.dynamicTitle,
  }),
  actions: {
    // 修改布局设置
    changeSetting(data: any) {
      const { key, value } = data;
      // @ts-ignore
      if (![null, undefined].includes(this[key])) {
        // @ts-ignore
        this[key] = value;
      }
      // if (this.hasOwnProperty(key)) {
      //   this[key] = value;
      // }
    },
    // 设置网页标题
    setTitle(title: string) {
      this.title = title;
      useDynamicTitle();
    },
  },
});

export default useSettingsStore;
