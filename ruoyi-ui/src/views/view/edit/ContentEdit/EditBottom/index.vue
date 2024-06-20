<template>
  <div class="canvas-bottom">
    <el-select
      ref="selectInstRef"
      v-model="filterValue"
      size="small"
      :disabled="lockScale"
      @change="selectHandle"
    >
      <el-option
        v-for="item in filterOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-tooltip :content="lockScale ? '解锁' : '锁定'">
      <el-button @click="lockHandle" type="text">
        <el-icon size="20px">
          <component :is="lockScale ? 'Unlock' : 'Lock'" />
        </el-icon>
      </el-button>
    </el-tooltip>

    <el-slider
      v-model="sliderValue"
      size="small"
      :default-value="50"
      :min="10"
      :max="100"
      :step="5"
      :format-tooltip="sliderFormatTooltip"
      :disabled="lockScale"
      :marks="sliderMaks"
      @change="sliderHandle"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, watchEffect } from 'vue';

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { EditCanvasTypeEnum } from '@/store/modules/chartEditStore/chartEditStore.d';
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore';
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d';

const chartLayoutStore = useChartLayoutStore();
const chartEditStore = useChartEditStore();
const { lockScale, scale } = toRefs(chartEditStore.getEditCanvas);
const selectInstRef = ref(null);

// 缩放选项
let filterOptions = [
  {
    label: '自适应',
    value: 0,
  },
  {
    label: '100%',
    value: 100,
  },
  {
    label: '75%',
    value: 75,
  },
  {
    label: '50%',
    value: 50,
  },
  {
    label: '25%',
    value: 25,
  },
];

// 选择值
const filterValue = ref('');

// 用户自选择
const selectHandle = (v: number) => {
  if (v === 0) {
    chartLayoutStore.setItemUnHandle(
      ChartLayoutStoreEnum.RE_POSITION_CANVAS,
      true,
    );
    chartEditStore.computedScale();
    return;
  }
  chartEditStore.setScale(v / 100);
};

// 点击锁处理
const lockHandle = () => {
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.LOCK_SCALE, !lockScale.value);
};

// 拖动
const sliderValue = ref(100);

// 拖动格式化
const sliderFormatTooltip = (v: string) => `${v}%`;

// 拖动处理
const sliderHandle = (v: number) => {
  chartEditStore.setScale(v / 100);
};

const sliderMaks = reactive({});

// 监听 scale 变化
watchEffect(() => {
  const value = (scale.value * 100).toFixed(0);
  filterValue.value = `${value}%`;
  sliderValue.value = parseInt(value);
});
</script>

<style lang="scss" scoped>
.canvas-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 40px;
  padding: 5px 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-text {
    position: absolute;
    left: 60px;
    top: 50%;
    transform: translateY(-50%);
  }

  .el-select {
    width: 100px;
  }
  .el-button {
    margin-left: 12px;
    margin-right: 12px;
  }

  .el-slider {
    position: relative;
    width: 200px;
  }
}
</style>
