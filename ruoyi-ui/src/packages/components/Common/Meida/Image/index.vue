<template>
  <div :style="getStyle(borderRadius)">
    <img class="image" :src="option.dataset" />
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs } from 'vue';

import { useChartDataFetch } from '@/hooks';
import type { CreateComponentType } from '@/packages/index.d';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
});

const { borderRadius } = toRefs(props.chartConfig.option);

const getStyle = (radius: number) => {
  return {
    borderRadius: `${radius}px`,
    overflow: 'hidden',
  };
};

const { fit } = toRefs(props.chartConfig.option);

const option = shallowReactive({
  dataset: '',
});

// 编辑更新
watch(
  () => props.chartConfig.option.dataset,
  (newData: any) => {
    option.dataset = newData;
  },
  {
    immediate: true,
  },
);

// 预览更新
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: any) => {
  option.dataset = newData;
});
</script>

<style scoped>
.image {
  width: 100%;
  height: 100%;
  object-fit: v-bind(fit);
}
</style>
