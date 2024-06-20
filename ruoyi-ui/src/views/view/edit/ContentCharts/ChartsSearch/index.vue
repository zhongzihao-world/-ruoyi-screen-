<template>
  <el-button-group>
    <el-button
      size="small"
      v-for="item in chartModeList"
      :key="item.icon"
      :type="chartMode === item.value ? 'primary' : ''"
      :icon="item.icon"
      @click="changeChartModeType(item.value)"
    />
  </el-button-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import {
  ChartModeEnum,
  ChartLayoutStoreEnum,
} from '@/store/modules/chartLayoutStore/chartLayoutStore.d';
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore';

const chartLayoutStore = useChartLayoutStore();
const chartMode = ref<ChartModeEnum>(chartLayoutStore.getChartType);

const chartModeList = [
  { label: '单列', icon: 'Menu', value: ChartModeEnum.SINGLE },
  { label: '双列', icon: 'Grid', value: ChartModeEnum.DOUBLE },
];

const changeChartModeType = (value: ChartModeEnum) => {
  chartMode.value = value;
  chartLayoutStore.setItem(ChartLayoutStoreEnum.Chart_TYPE, value);
};
</script>

<style lang="scss" scoped></style>
