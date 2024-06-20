<template>
  <video
    ref="vVideoRef"
    class="video"
    preload="auto"
    crossOrigin="anonymous"
    playsinline
    autoplay
    :loop="option.loop"
    :muted="option.muted"
    :src="option.dataset"
  ></video>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, ref } from 'vue';

import type { CreateComponentType } from '@/packages/index.d';
import { useChartDataFetch } from '@/hooks';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { option as configOption } from './config';

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
});

let option = shallowReactive({ ...configOption });

// 预览更新
const vVideoRef = ref(null);
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: any) => {
  option = newData;
});

// 编辑更新
watch(
  () => props.chartConfig.option,
  (newData: any) => {
    option = newData;
    if (!vVideoRef.value) return;
    const video: any = vVideoRef.value;
    video.loop = option.loop;
    video.muted = option.muted;
    video.play();
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>

<style lang="scss" scoped>
.video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: v-bind('option.fit');
}
</style>
