<template>
  <div
    ref="compItemRef"
    class="comp-list"
    :class="[chartMode === ChartModeEnum.DOUBLE ? 'double' : 'single']"
  >
    <div
      class="compItem"
      v-for="(item, index) in menuOptions"
      :key="index"
      draggable
      @dragstart="dragStartHandle($event, item)"
      @dragend="dragendHandle"
      @dblclick="dblclickHandle(item)"
    >
      <ChartsImage class="compItem-img" :chartConfig="item" />
      <el-text truncated>
        {{ item.title }}
      </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, Ref, computed } from 'vue';
import omit from 'lodash/omit';

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { EditCanvasTypeEnum } from '@/store/modules/chartEditStore/chartEditStore.d';
import { ChartModeEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d';
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore';
import {
  componentInstall,
  loadingStart,
  loadingFinish,
  loadingError,
  JSONStringify,
} from '@/utils';
import { DragKeyEnum } from '@/enums/editPageEnum';
import { createComponent } from '@/packages';
import { ConfigType, CreateComponentType } from '@/packages/index.d';
import { fetchConfigComponent, fetchChartComponent } from '@/packages/index';
import ChartsImage from '../ChartsImage/index.vue';

defineProps({
  menuOptions: {
    type: Array as PropType<ConfigType[]>,
    default: () => [],
  },
});

const chartEditStore = useChartEditStore();

const chartLayoutStore = useChartLayoutStore();
const compItemRef = ref();

// 组件展示状态
const chartMode: Ref<ChartModeEnum> = computed(() => {
  return chartLayoutStore.getChartType;
});

// 拖拽处理
const dragStartHandle = (e: DragEvent, item: ConfigType) => {
  // 动态注册图表组件
  componentInstall(item.chartKey, fetchChartComponent(item));
  componentInstall(item.conKey, fetchConfigComponent(item));
  // 将配置项绑定到拖拽属性上
  e!.dataTransfer!.setData(
    DragKeyEnum.DRAG_KEY,
    JSONStringify(omit(item, ['image'])),
  );
  // 修改状态
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, true);
};

// 拖拽结束
const dragendHandle = () => {
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, false);
};

// 双击添加
const dblclickHandle = async (item: ConfigType) => {
  try {
    loadingStart();
    // 注册组件
    componentInstall(item.chartKey, fetchChartComponent(item));
    componentInstall(item.conKey, fetchConfigComponent(item));
    // 创建新图表组件
    let newComponent: CreateComponentType = await createComponent(item);
    // 添加
    chartEditStore.addComponentList(newComponent, false, true);
    // 选中
    chartEditStore.setTargetSelectChart(newComponent.id);
  } catch (error) {
    console.log(error);
    loadingError();
  } finally {
    loadingFinish();
  }
};
</script>

<style lang="scss" scoped>
.comp-list {
  padding: 0 10px;
  height: 100%;
  overflow: auto;
  .compItem {
    width: 150px;
    text-align: center;
    .compItem-img {
      width: 100%;
      height: 90px;
      cursor: move;
    }
  }
  &.double {
    .compItem {
      width: 70px;
      display: inline-block;
      &:nth-child(2n -1) {
        margin-right: 12px;
      }
      .compItem-img {
        width: 100%;
        height: 70px;
        cursor: move;
      }
      .el-text {
        font-size: 10px;
      }
    }
  }
}
</style>
