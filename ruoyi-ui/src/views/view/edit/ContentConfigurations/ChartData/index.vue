<template>
  <div class="chart-data" v-if="targetData">
    <el-form label-width="auto" label-position="left" size="default">
      <el-form-item label="数据来源">
        <el-select
          v-model="targetData.request.requestDataType"
          :disabled="isNotData"
        >
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 静态 -->
    <chart-data-static
      v-if="targetData.request.requestDataType === RequestDataTypeEnum.STATIC"
    />

    <!-- 动态接口 -->
    <chart-data-ajax
      v-if="targetData.request.requestDataType === RequestDataTypeEnum.AJAX"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { loadAsyncComponent } from '@/utils';
import { RequestDataTypeEnum } from '@/enums/httpEnum';
import { ChartFrameEnum } from '@/packages/index.d';
import { useTargetData } from '../hooks/useTargetData.hook';
import { SelectCreateDataType, SelectCreateDataEnum } from './index.d';

const ChartDataStatic = loadAsyncComponent(
  () => import('./ChartDataStatic/index.vue'),
);
const ChartDataAjax = loadAsyncComponent(
  () => import('./ChartDataAjax/index.vue'),
);

const { targetData } = useTargetData();

// 选项
const selectOptions: SelectCreateDataType[] = [
  {
    label: SelectCreateDataEnum.STATIC,
    value: RequestDataTypeEnum.STATIC,
  },
  {
    label: SelectCreateDataEnum.AJAX,
    value: RequestDataTypeEnum.AJAX,
  },
];

// 无数据源
const isNotData = computed(() => {
  return (
    targetData.value.chartConfig?.chartFrame === ChartFrameEnum.STATIC ||
    typeof targetData.value?.option?.dataset === 'undefined'
  );
});
</script>

<style lang="scss" scoped>
.chart-data {
  padding: 20px 10px;
}
</style>
