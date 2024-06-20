<template>
  <el-card
    v-for="(value, key) in comChartColors"
    :key="key"
    :class="{ selected: key === selectName }"
    @click="selectTheme(key)"
  >
    <div class="color-item">
      <el-text truncated>
        {{ value.name }}
      </el-text>

      <span
        class="color-item-block"
        v-for="colorItem in fetchShowColors(value.color)"
        :key="colorItem"
        :style="{ backgroundColor: colorItem }"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import cloneDeep from 'lodash/cloneDeep';

import useSettingsStore from '@/store/modules/settings';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { EditCanvasConfigEnum } from '@/store/modules/chartEditStore/chartEditStore.d';
import { ChartColorsNameType } from '@/settings/chartThemes/index';
import { colorCustomMerge } from '@/utils';

const chartEditStore = useChartEditStore();

// 全局颜色
const settingsStore = useSettingsStore();
// 颜色
const themeColor = computed(() => {
  return settingsStore.theme;
});

// 合并默认颜色和自定义颜色
const comChartColors = computed(() => {
  return colorCustomMerge(
    chartEditStore.getEditCanvasConfig.chartCustomThemeColorInfo,
  );
});

// 选中名称
const selectName = computed(() => {
  return chartEditStore.getEditCanvasConfig.chartThemeColor;
});

// 获取用来展示的色号
const fetchShowColors = (colors: Array<string>) => {
  return cloneDeep(colors).splice(0, 6);
};

// 设置主体色（在 ContentEdit > List 中进行注入）
const selectTheme = (theme: ChartColorsNameType) => {
  chartEditStore.setEditCanvasConfig(
    EditCanvasConfigEnum.CHART_THEME_COLOR,
    theme,
  );
};
</script>

<style lang="scss" scoped>
.el-card {
  cursor: pointer;
  margin-top: 15px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 8px;

  :deep(.el-card__body) {
    padding: 10px 15px !important;
  }

  &:hover,
  &.selected {
    border-color: v-bind(themeColor);
  }

  .color-item {
    display: flex;
    justify-content: space-between;

    .el-text {
      width: 60px;
    }
    .color-item-block {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
