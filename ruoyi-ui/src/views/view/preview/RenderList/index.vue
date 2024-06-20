<template>
  <div
    class="chart-item"
    v-for="(item, index) in chartEditStore.componentList"
    :key="item.id"
    :style="{
      ...getComponentAttrStyle(item.attr, index),
      ...getCssStyle(item.styles),
      ...getStatusStyle(item.status),
      ...getPreviewConfigStyle(item.preview),
    }"
  >
    <RenderGroup
      v-if="item.isGroup"
      :groupData="(item as CreateComponentGroupType)"
      :groupIndex="index"
      :themeSetting="themeSetting"
      :themeColor="themeColor"
    />

    <component
      v-else
      :is="item.chartConfig.chartKey"
      :id="item.id"
      :chartConfig="item"
      :themeSetting="themeSetting"
      :themeColor="themeColor"
      :style="{ ...getSizeStyle(item.attr) }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { useChartDataPondFetch } from '@/hooks';
import { CreateComponentGroupType } from '@/packages/index.d';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { colorCustomMerge } from '@/utils';
import RenderGroup from '../RenderGroup/index.vue';
import {
  getSizeStyle,
  getComponentAttrStyle,
  getCssStyle,
  getStatusStyle,
  getPreviewConfigStyle,
} from '../utils/style';

// 初始化数据池
const { initDataPond, clearMittDataPondMap } = useChartDataPondFetch();
const chartEditStore = useChartEditStore();

// 主题色
const themeSetting = computed(() => {
  const chartThemeSetting = chartEditStore.editCanvasConfig.chartThemeSetting;
  return chartThemeSetting;
});

// 配置项
const themeColor = computed(() => {
  const colorCustomMergeData = colorCustomMerge(
    chartEditStore.editCanvasConfig.chartCustomThemeColorInfo,
  );
  return colorCustomMergeData[chartEditStore.editCanvasConfig.chartThemeColor];
});

// 组件渲染结束初始化数据池
clearMittDataPondMap();
onMounted(() => {
  initDataPond(chartEditStore.requestGlobalConfig);
});
</script>

<style lang="scss" scoped>
.chart-item {
  position: absolute;
}
</style>
