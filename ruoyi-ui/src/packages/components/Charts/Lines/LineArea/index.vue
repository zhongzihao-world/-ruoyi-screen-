<template>
  <v-chart
    ref="vChartRef"
    :option="option"
    :init-options="initOptions"
    :theme="themeColor"
    :manual-update="isPreview()"
    :update-options="{
      replaceMerge: replaceMergeArr,
    }"
    autoresize
  />
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, PropType } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import isObject from 'lodash/isObject';

import { useCanvasInitOptions } from '@/hooks/useCanvasInitOptions.hook';
import { mergeTheme } from '@/packages/public/chart';
import { useChartDataFetch } from '@/hooks';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { isPreview } from '@/utils';
import config, { includes, seriesItem } from './config';

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
  LineChart,
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
      if (!isObject(newData) || !('dimensions' in newData)) return;
      if (Array.isArray(newData?.dimensions)) {
        const seriesArr = [];
        for (let i = 0; i < newData.dimensions.length - 1; i++) {
          seriesArr.push(seriesItem);
        }
        replaceMergeArr.value = ['series'];
        props.chartConfig.option.series = seriesArr;
        nextTick(() => {
          replaceMergeArr.value = [];
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  {
    deep: false,
  },
);
</script>
