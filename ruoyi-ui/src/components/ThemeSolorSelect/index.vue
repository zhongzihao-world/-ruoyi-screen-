<template>
  <el-color-picker
    v-model="theme"
    :predefine="colorsPicker"
    @active-change="activeChangeHandle"
    @change="changHandle"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import defaultSettings from '@/settings';
import useSettingsStore from '@/store/modules/settings';
import { handleThemeStyle } from '@/utils/theme';
import { colorsPicker } from '@/config';

const { color } = defaultSettings;

const settingsStore = useSettingsStore();

const theme = ref(settingsStore.theme);

const activeChangeHandle = (val: string) => {
  const selectColor = val ? val : color;
  settingsStore.changeSetting({ key: 'theme', value: selectColor });
  theme.value = selectColor;
  handleThemeStyle(selectColor);
};
const changHandle = () => {
  let layoutSetting = {
    topNav: settingsStore.topNav,
    tagsView: settingsStore.tagsView,
    fixedHeader: settingsStore.fixedHeader,
    sidebarLogo: settingsStore.sidebarLogo,
    dynamicTitle: settingsStore.dynamicTitle,
    sideTheme: settingsStore.sideTheme,
    theme: theme.value ? theme.value : color,
  };
  localStorage.setItem('layout-setting', JSON.stringify(layoutSetting));
};
</script>
