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
import { ScatterChart, EffectScatterChart } from 'echarts/charts';
import {
  TitleComponent,
  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
} from 'echarts/components';

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
  TitleComponent,
  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ScatterChart,
  EffectScatterChart,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
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
  (newData, oldData) => {
    try {
      if (!Array.isArray(newData)) return;
      replaceMergeArr.value = ['series'];
      // eslint-disable-next-line vue/no-mutating-props
      props.chartConfig.option.series = newData.map(
        (item: { dimensions: any[] }, index: number) => ({
          ...seriesItem,
          datasetIndex: index,
        }),
      );
      nextTick(() => {
        replaceMergeArr.value = [];
      });
    } catch (error) {
      console.log(error);
    }
  },
  {
    deep: false,
  },
);
</script>
