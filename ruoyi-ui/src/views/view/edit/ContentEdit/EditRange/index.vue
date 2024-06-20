<template>
  <div
    class="canvas-range"
    :style="{
      transform: `scale(${scale})`,
      ...rangeStyle,
    }"
    @mousedown="mousedownBoxSelect($event)"
  >
    <slot />

    <!-- 拖拽时的辅助线 -->
    <EditAlignLine />

    <!-- 框选时的样式框 -->
    <EditSelect />
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { useSizeStyle } from '../hooks/useStyle.hook';
import { mousedownBoxSelect } from '../hooks/useDrag.hook';
import EditAlignLine from '../EditAlignLine/index.vue';
import EditSelect from '../EditSelect/index.vue';

const chartEditStore = useChartEditStore();

const { getEditCanvasConfig } = toRefs(chartEditStore);

const size = computed(() => {
  return {
    w: getEditCanvasConfig.value.width,
    h: getEditCanvasConfig.value.height,
  };
});

// 缩放比例
const scale = computed(() => {
  return chartEditStore.getEditCanvas.scale;
});

const rangeStyle = computed(() => {
  // @ts-ignore
  return { ...useSizeStyle(size.value) };
});
</script>

<style lang="scss" scoped>
.canvas-range {
  position: relative;
  transform-origin: left top;
  background-size: cover;
  overflow: hidden;
}
</style>
