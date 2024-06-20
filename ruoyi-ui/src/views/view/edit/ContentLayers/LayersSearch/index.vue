<template>
  <el-button-group>
    <el-button
      size="small"
      v-for="item in layerModeList"
      :key="item.icon"
      :icon="item.icon"
      :type="layerMode === item.value ? 'primary' : ''"
      @click="changeLayerType(item.value)"
    />
  </el-button-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore';
import {
  ChartLayoutStoreEnum,
  LayerModeEnum,
} from '@/store/modules/chartLayoutStore/chartLayoutStore.d';

const chartLayoutStore = useChartLayoutStore();

const layerModeList = [
  { label: '缩略图', icon: 'Picture', value: LayerModeEnum.THUMBNAIL },
  { label: '文本列表', icon: 'Operation', value: LayerModeEnum.TEXT },
];

const layerMode = ref<LayerModeEnum>(chartLayoutStore.getLayerType);

const changeLayerType = (value: LayerModeEnum) => {
  layerMode.value = value;
  chartLayoutStore.setItem(ChartLayoutStoreEnum.LAYER_TYPE, value);
};
</script>

<style lang="scss" scoped></style>
