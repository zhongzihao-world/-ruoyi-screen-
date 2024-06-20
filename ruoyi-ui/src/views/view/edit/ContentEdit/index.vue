<template>
  <div
    id="canvas-layout"
    @mousedown="mousedownHandleUnStop"
    @drop="dragHandle"
    @dragover="dragoverHandle"
    @dragenter="dragoverHandle"
  >
    <!-- 画布主体 -->
    <EditRule>
      <div id="canvas-content" @contextmenu="handleContextMenu">
        <EditRange>
          <div
            :style="{
              ...rangeStyle,
            }"
          >
            <template
              v-for="(item, index) in chartEditStore.getComponentList"
              :key="item.id"
            >
              <EditGroup
                v-if="item.isGroup"
                :groupData="(item as CreateComponentGroupType)"
                :groupIndex="index"
              />

              <EditShapeBox
                v-else
                :data-id="item.id"
                :index="index"
                :style="{
                  ...useComponentStyle(item.attr, index),
                }"
                :item="item"
                @click="mouseClickHandle($event, item)"
                @mousedown="mousedownHandle($event, item)"
                @mouseenter="mouseenterHandle($event, item)"
                @mouseleave="mouseleaveHandle($event, item)"
                @contextmenu="handleContextMenu($event, item, optionsHandle)"
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
            </template>
          </div>
        </EditRange>
      </div>
    </EditRule>

    <!-- 底部面板 -->
    <EditBottom />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed, provide } from 'vue';

import { MenuEnum } from '@/enums/editPageEnum';
import {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import { colorCustomMerge } from '@/utils';
import { useContextMenu } from '@/views/view/edit/hooks/useContextMenu.hook';
import { MenuOptionsItemType } from '@/views/view/edit/hooks/useContextMenu.hook.d';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { SCALE_KEY } from '@/views/view/preview/hooks/useScale.hook';
import { useLayout } from './hooks/useLayout.hook';
import { useAddKeyboard } from '../hooks/useKeyboard.hook';
import {
  dragHandle,
  dragoverHandle,
  mousedownHandleUnStop,
  useMouseHandle,
} from './hooks/useDrag.hook';
import {
  useComponentStyle,
  useSizeStyle,
  useCssStyle,
} from './hooks/useStyle.hook';

import EditRule from './EditRule/index.vue';
import EditRange from './EditRange/index.vue';
import EditGroup from './EditGroup/index.vue';
import EditShapeBox from './EditShapeBox/index.vue';
import EditBottom from './EditBottom/index.vue';

const chartEditStore = useChartEditStore();
const { handleContextMenu } = useContextMenu();

// 编辑时注入scale变量，消除警告
provide(SCALE_KEY, null);

// 布局处理
useLayout();

// 点击事件
const {
  mouseClickHandle,
  mouseenterHandle,
  mouseleaveHandle,
  mousedownHandle,
} = useMouseHandle();

// 右键事件
const optionsHandle = (
  targetList: MenuOptionsItemType[],
  allList: MenuOptionsItemType[],
  targetInstance: CreateComponentType,
) => {
  // 多选处理
  if (chartEditStore.getTargetChart.selectId.length > 1) {
    return allList.filter(i =>
      [MenuEnum.GROUP, MenuEnum.DELETE].includes(i.key as MenuEnum),
    );
  }
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
  return targetList.filter(i => !statusMenuEnums.includes(i.key as MenuEnum));
};

// 主题色
const themeSetting = computed(() => {
  const chartThemeSetting =
    chartEditStore.getEditCanvasConfig.chartThemeSetting;
  return chartThemeSetting;
});

// 配置项
const themeColor = computed(() => {
  const colorCustomMergeData = colorCustomMerge(
    chartEditStore.getEditCanvasConfig.chartCustomThemeColorInfo,
  );
  return colorCustomMergeData[
    chartEditStore.getEditCanvasConfig.chartThemeColor
  ];
});

// 背景
const rangeStyle = computed(() => {
  // 设置背景色和图片背景
  const background = chartEditStore.getEditCanvasConfig.background;
  const backgroundImage = chartEditStore.getEditCanvasConfig.backgroundImage;
  const selectColor = chartEditStore.getEditCanvasConfig.selectColor;
  const backgroundColor = background ? background : undefined;

  const computedBackground = selectColor
    ? { background: backgroundColor }
    : {
        background: `url(${backgroundImage}) no-repeat center center / cover !important`,
      };

  // @ts-ignore
  return {
    ...computedBackground,
    width: 'inherit',
    height: 'inherit',
  };
});

// 键盘事件
onMounted(() => {
  useAddKeyboard();
});
</script>

<style lang="scss" scoped>
#canvas-layout {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  #canvas-content {
    overflow: hidden;

    .canvas-item {
      position: absolute;
    }
  }
}
</style>
