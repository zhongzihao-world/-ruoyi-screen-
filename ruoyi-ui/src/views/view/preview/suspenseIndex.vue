<template>
  <div
    :class="`preview-layout ${chartEditStore.editCanvasConfig.previewScaleType}`"
  >
    <template v-if="showEntity">
      <!-- 实体区域 -->
      <div ref="entityRef" class="preview-entity">
        <!-- 缩放层 -->
        <div ref="previewRef" class="preview-scale">
          <!-- 展示层 -->
          <div :style="previewRefStyle">
            <!-- 渲染层 -->
            <RenderList />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- 缩放层 -->
      <div ref="previewRef" class="preview-scale">
        <!-- 展示层 -->
        <div :style="previewRefStyle">
          <!-- 渲染层 -->
          <RenderList />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { PreviewScaleEnum } from '@/enums/styleEnum';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import RenderList from './RenderList/index.vue';
import { getEditCanvasConfigStyle } from './utils/style';
import { useScale } from './hooks/useScale.hook';
import { initView } from './index';

const chartEditStore = useChartEditStore();
await initView(chartEditStore);

const { entityRef, previewRef } = useScale(chartEditStore);

const previewRefStyle = computed(() => {
  return {
    ...getEditCanvasConfigStyle(chartEditStore.editCanvasConfig),
  };
});

const showEntity = computed(() => {
  const type = chartEditStore.editCanvasConfig.previewScaleType;
  return (
    type === PreviewScaleEnum.SCROLL_Y || type === PreviewScaleEnum.SCROLL_X
  );
});
</script>

<style lang="scss" scoped>
.preview-layout {
  position: relative;
  height: 100vh;
  width: 100vw;
  &.fit,
  &.full {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .preview-scale {
      transform-origin: center center;
    }
  }
  &.scrollY {
    overflow-x: hidden;
    .preview-scale {
      transform-origin: left top;
    }
  }
  &.scrollX {
    overflow-y: hidden;
    .preview-scale {
      transform-origin: left top;
    }
  }
  .preview-entity {
    overflow: hidden;
  }
}
</style>
