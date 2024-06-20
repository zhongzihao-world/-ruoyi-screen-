<template>
  <div class="canvas-group-box">
    <EditShapeBox
      :key="groupData.id"
      :data-id="groupData.id"
      :index="groupIndex"
      :item="groupData"
      :hiddenPoint="true"
      :style="{
        ...useComponentStyle(groupData.attr, groupIndex),
        ...useSizeStyle(groupData.attr),
        ...useCssStyle(groupData.styles),
      }"
      @click="mouseClickHandle($event, groupData)"
      @mousedown="mousedownHandle($event, groupData)"
      @mouseenter="mouseenterHandle($event, groupData)"
      @mouseleave="mouseleaveHandle($event, groupData)"
      @contextmenu="handleContextMenu($event, groupData, optionsHandle)"
    >
      <!-- 组合组件 -->
      <EditShapeBox
        v-for="item in groupData.groupList"
        :key="item.id"
        :data-id="item.id"
        :index="groupIndex"
        :item="item"
        :hiddenPoint="true"
        :style="{
          ...useComponentStyle(item.attr, groupIndex),
        }"
      >
        <component
          class="canvas-item"
          :is="item.chartConfig.chartKey"
          :chartConfig="item"
          :themeSetting="themeSetting"
          :themeColor="themeColor"
          :style="{
            ...useSizeStyle(item.attr),
            ...useCssStyle(item.styles),
          }"
        />
      </EditShapeBox>
    </EditShapeBox>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

import { MenuEnum } from '@/enums/editPageEnum';
import {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import { MenuOptionsItemType } from '@/views/view/edit/hooks/useContextMenu.hook.d';
import { colorCustomMerge } from '@/utils';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { useContextMenu } from '@/views/view/edit/hooks/useContextMenu.hook';
import { useMouseHandle } from '../hooks/useDrag.hook';
import {
  useComponentStyle,
  useSizeStyle,
  useCssStyle,
} from '../hooks/useStyle.hook';
import EditShapeBox from '../EditShapeBox/index.vue';

const props = defineProps({
  groupData: {
    type: Object as PropType<CreateComponentGroupType>,
    required: true,
  },
  groupIndex: {
    type: Number,
    required: true,
  },
});

const chartEditStore = useChartEditStore();
const { handleContextMenu } = useContextMenu();

// 点击事件
const {
  mouseClickHandle,
  mouseenterHandle,
  mouseleaveHandle,
  mousedownHandle,
} = useMouseHandle();

// 右键
const optionsHandle = (
  targetList: MenuOptionsItemType[],
  allList: MenuOptionsItemType[],
  targetInstance: CreateComponentType,
) => {
  const filter = (menulist: MenuEnum[]) => {
    return allList.filter(i => menulist.includes(i.key as MenuEnum));
  };

  // 多选处理
  if (chartEditStore.getTargetChart.selectId.length > 1) {
    return filter([MenuEnum.GROUP, MenuEnum.DELETE]);
  } else {
    const statusMenuEnums: MenuEnum[] = [];
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
    // 单选
    const singleMenuEnums = [MenuEnum.UN_GROUP];
    return [
      ...filter(singleMenuEnums),
      ...targetList.filter(i => !statusMenuEnums.includes(i.key as MenuEnum)),
    ];
  }
};

// 配置项
const themeColor = computed(() => {
  const colorCustomMergeData = colorCustomMerge(
    chartEditStore.getEditCanvasConfig.chartCustomThemeColorInfo,
  );
  return colorCustomMergeData[
    chartEditStore.getEditCanvasConfig.chartThemeColor
  ];
});

// 主题色
const themeSetting = computed(() => {
  const chartThemeSetting =
    chartEditStore.getEditCanvasConfig.chartThemeSetting;
  return chartThemeSetting;
});
</script>
