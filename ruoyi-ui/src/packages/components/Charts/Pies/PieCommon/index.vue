<template>
  <v-chart
    ref="vChartRef"
    :option="option"
    :init-options="initOptions"
    :theme="themeColor"
    :manual-update="isPreview()"
    :update-options="{}"
    autoresize
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';

import { useCanvasInitOptions } from '@/hooks/useCanvasInitOptions.hook';
import { mergeTheme } from '@/packages/public/chart';
import { useChartDataFetch } from '@/hooks';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { isPreview } from '@/utils';
import config, { includes } from './config';

const props = defineProps({
  themeSetting: {
    type: Object,
    required: true,
  },
  themeColor: {
    type: Object,
    required: true,
  },
  chartConfig: {
    type: Object as PropType<config>,
    required: true,
  },
});

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);
const { vChartRef } = useChartDataFetch(props.chartConfig, useChartEditStore);

// 参数
const option = computed(() => {
  return mergeTheme(props.chartConfig.option, props.themeSetting, includes);
});
// 附加参数
const initOptions = useCanvasInitOptions(
  props.chartConfig.option,
  props.themeSetting,
);

const replaceMergeArr = ref<string[]>();
// dataset 无法变更条数的补丁
watch(
  () => props.chartConfig.option.dataset,
  (newData: { dimensions: any }, oldData) => {
    try {
      //
    } catch (error) {
      console.log(error);
    }
  },
  {
    deep: false,
  },
);
</script>
