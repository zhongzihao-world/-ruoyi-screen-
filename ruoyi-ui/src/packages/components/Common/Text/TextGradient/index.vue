<template>
  <div class="text-gradient">
    <span>{{ option.dataset }}</span>
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
.text-gradient {
  display: flex;
  justify-content: v-bind('textAlignX');
  align-items: v-bind('textAlignY');
  font-size: v-bind('fontSize + "px"');
  letter-spacing: v-bind('letterSpacing + "px"');
  background: linear-gradient(
    v-bind('color.deg + "deg"'),
    v-bind('color.from') 0%,
    v-bind('color.to') 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
