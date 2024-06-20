<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { onMounted, nextTick } from 'vue';

import useSettingsStore from '@/store/modules/settings';
import { handleThemeStyle } from '@/utils/theme';

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);
  });
});
</script>
