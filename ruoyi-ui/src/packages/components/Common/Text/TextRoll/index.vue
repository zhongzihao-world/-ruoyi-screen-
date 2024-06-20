<template>
  <div class="text-roll" style="overflow: hidden;"> 
    <div class="content">
      <span>{{ option.dataset }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, computed } from 'vue';

import type { CreateComponentType } from '@/packages/index.d';
import { option as configOption } from './config';

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType & typeof option>,
    required: true,
  },
});

const { w } = toRefs(props.chartConfig.attr);
const {
  fontSize,
  letterSpacing,
  textAlignX,
  textAlignY,
  color,
  animationTime,
  animationSpeed,
} = toRefs(props.chartConfig.option);

const transitionDuration = computed(() => {
  return Math.floor((w.value as any) / (animationSpeed.value as any));
});

const option = shallowReactive({
  dataset: configOption.dataset,
});

// 手动更新
watch(
  () => props.chartConfig.option.dataset,
  (newData: any) => {
    option.dataset = newData;
  },
  {
    immediate: true,
    deep: false,
  },
);
</script>

<style lang="scss" scoped>
.text-roll {
  position: relative;
  display: flex;
  justify-content: v-bind('textAlignX');
  align-items: v-bind('textAlignY');
  .content {
    position: absolute;
    width: 100%;
    font-size: v-bind('fontSize + "px"');
    letter-spacing: v-bind('letterSpacing + "px"');
    color: v-bind('color');
    animation: roll v-bind('transitionDuration + "s"') linear
      v-bind('animationTime + "s"') infinite;

    @keyframes roll {
      from {
        left: 100%;
        transform: translateX(0);
      }
      to {
        left: 50px;
        transform: translateX(-100%);
      }
    }
  }
}
</style>
