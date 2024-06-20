<template>
  <div class="layers-hd">
    <el-text truncated>
      <strong style="font-size: 18px">图层</strong>
    </el-text>

    <LayersSearch />
  </div>

  <Draggable
    v-if="reverseList.length"
    item-key="id"
    v-model="layerList"
    ghostClass="ghostClass"
    class="layers-bd"
    @change="onMoveCallback"
  >
    <template #item="{ element }">
      <div>
        <!-- 组合 -->
        <LayersGroupListItem
          v-if="element.isGroup"
          :componentGroupData="element"
          :layer-mode="layerMode"
        />

        <!-- 单个 -->
        <LayersListItem
          v-else
          :componentData="element"
          :layer-mode="layerMode"
          @mousedown="mousedownHandle($event, element)"
          @mouseenter="mouseenterHandle(element)"
          @mouseleave="mouseleaveHandle(element)"
          @contextmenu="handleContextMenu($event, element, optionsHandle)"
        />
      </div>
    </template>
  </Draggable>
  <el-empty v-else />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Draggable from 'vuedraggable';
import cloneDeep from 'lodash/cloneDeep';

import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore';

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import { MenuOptionsItemType } from '@/views/view/edit/hooks/useContextMenu.hook.d';
import { useContextMenu } from '@/views/view/edit/hooks/useContextMenu.hook';
import { MenuEnum, MouseEventButton } from '@/enums/editPageEnum';
import LayersListItem from './LayersListItem/index.vue';
import LayersGroupListItem from './LayersGroupListItem/index.vue';
import LayersSearch from './LayersSearch/index.vue';

const chartLayoutStore = useChartLayoutStore();
const chartEditStore = useChartEditStore();
const { handleContextMenu, onClickOutSide } = useContextMenu();

const layerMode = computed(() => chartLayoutStore.getLayerType);
const layerList = ref<any>([]);

// 逆序展示
const reverseList = computed(() => {
  const list: Array<CreateComponentType | CreateComponentGroupType> = cloneDeep(
    chartEditStore.getComponentList,
  );
  return list.reverse();
});

watch(
  () => reverseList.value,
  newValue => {
    layerList.value = newValue;
  },
  {
    immediate: true,
  },
);

// 右键事件
const optionsHandle = (
  targetList: MenuOptionsItemType[],
  allList: MenuOptionsItemType[],
  targetInstance: CreateComponentType,
) => {
  // 多选处理
  if (chartEditStore.getTargetChart.selectId.length > 1) {
    return targetList.filter(i => i.key === MenuEnum.GROUP);
  }
  const statusMenuEnums: MenuEnum[] = [];
  // 处理锁定与隐藏
  if (targetInstance.status.lock) {
    statusMenuEnums.push(MenuEnum.LOCK);
  } else {
    statusMenuEnums.push(MenuEnum.UNLOCK);
  }
  if (targetInstance.status.hide) {
    statusMenuEnums.push(MenuEnum.HIDE);
  } else {
    statusMenuEnums.push(MenuEnum.SHOW);
  }
  return targetList.filter(
    item => !statusMenuEnums.includes(item.key as MenuEnum),
  );
};

// 移动结束处理
const onMoveCallback = (val: any) => {
  const { oldIndex, newIndex } = val.moved;
  if (newIndex - oldIndex > 0) {
    // 从上往下
    const moveTarget = chartEditStore.getComponentList.splice(
      -(oldIndex + 1),
      1,
    )[0];
    chartEditStore.getComponentList.splice(-newIndex, 0, moveTarget);
  } else {
    // 从下往上
    const moveTarget = chartEditStore.getComponentList.splice(
      -(oldIndex + 1),
      1,
    )[0];
    if (newIndex === 0) {
      chartEditStore.getComponentList.push(moveTarget);
    } else {
      chartEditStore.getComponentList.splice(-newIndex, 0, moveTarget);
    }
  }
};

// 点击事件
const mousedownHandle = (e: MouseEvent, item: CreateComponentType) => {
  onClickOutSide();
  // 若此时按下了 CTRL, 表示多选
  const id = item.id;
  if (e.buttons === MouseEventButton.LEFT && window.$KeyboardActive?.ctrl) {
    // 若已选中，则去除
    if (chartEditStore.targetChart.selectId.includes(id)) {
      const exList = chartEditStore.targetChart.selectId.filter(e => e !== id);
      chartEditStore.setTargetSelectChart(exList);
    } else {
      chartEditStore.setTargetSelectChart(id, true);
    }
    return;
  }
  chartEditStore.setTargetSelectChart(id);
};

// 进入事件
const mouseenterHandle = (item: CreateComponentType) => {
  chartEditStore.setTargetHoverChart(item.id);
};

// 移出事件
const mouseleaveHandle = (item: CreateComponentType) => {
  chartEditStore.setTargetHoverChart(undefined);
};
</script>

<style lang="scss" scoped>
.layers-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px 0 10px;
  height: 24px;
  margin-bottom: 6px;
}
.layers-bd {
  padding: 0 10px;
  height: calc(100% - 30px);
  overflow: auto;
}
.ghostClass {
  opacity: 0.4;
}
</style>
