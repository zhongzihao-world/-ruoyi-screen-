<template>
  <swiper
    :modules="modules"
    :direction="direction"
    :autoplay="{ delay: 5000, disableOnInteraction: false }"
    :pagination="{ clickable: true }"
    mousewheel
    loop
  >
    <swiper-slide v-for="url in option.dataset" :key="url">
      <img class="image" :src="url" />
    </swiper-slide>
  </swiper>
</template>
<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch } from 'vue';
import { Autoplay, Mousewheel, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/pagination';

import type { CreateComponentType } from '@/packages/index.d';
import { option as configOption } from './config';

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
});

const option = shallowReactive({
  dataset: configOption.dataset,
});

const { fit, direction } = toRefs(props.chartConfig.option);

// 自定义模块
const modules = [Pagination, Mousewheel, Autoplay];

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

<style scoped>
.image {
  width: 100%;
  height: 100%;
  object-fit: v-bind(fit);
}
</style>
