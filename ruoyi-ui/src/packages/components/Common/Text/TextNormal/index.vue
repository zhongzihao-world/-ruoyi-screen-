<template>
  <div class="text-normal">
    <span>{{ option.dataset }}</span>
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs } from 'vue';

import type { CreateComponentType } from '@/packages/index.d';
import { option as configOption } from './config';

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType & typeof option>,
    required: true,
  },
});

const { fontSize, letterSpacing, textAlignX, textAlignY, color } = toRefs(
  props.chartConfig.option,
);

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
.text-normal {
  display: flex;
  justify-content: v-bind('textAlignX');
  align-items: v-bind('textAlignY');
  color: v-bind('color');
  font-size: v-bind('fontSize + "px"');
  letter-spacing: v-bind('letterSpacing + "px"');
}
</style>
