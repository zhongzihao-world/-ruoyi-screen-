<template>
  <div class="list-group-item">
    <div
      class="list-item"
      :class="{ active, 'list-text': selectText }"
      @click="clickHandle($event)"
      @mousedown="groupMousedownHandle($event)"
      @mouseenter="mouseenterHandle(componentGroupData)"
      @mouseleave="mouseleaveHandle(componentGroupData)"
      @contextmenu="
        handleContextMenu($event, componentGroupData, optionsHandle)
      "
    >
      <div class="list-item-box">
        <div class="list-item-content">
          <el-icon size="24px">
            <component :is="expend ? 'FolderOpened' : 'Folder'" />
          </el-icon>

          <el-text truncated>
            <el-tooltip :content="componentGroupData.chartConfig.title">
              {{ componentGroupData.chartConfig.title }}
            </el-tooltip>
          </el-text>
        </div>

        <LayersStatus :isGroup="false" :status="status" />
      </div>
    </div>

    <div style="padding-left: 15px" v-show="expend">
      <LayersListItem
        v-for="element in componentGroupData.groupList"
        :key="element.id"
        :componentData="element"
        :isGroup="true"
        :layer-mode="layerMode"
        @mousedown="mousedownHandle($event, element, componentGroupData.id)"
        @mouseenter="mouseenterHandle(element)"
        @mouseleave="mouseleaveHandle(element)"
        @contextmenu="
          handleContextMenu($event, componentGroupData, optionsHandle)
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue';

import { MouseEventButton } from '@/enums/editPageEnum';
import { MenuEnum } from '@/enums/editPageEnum';
import useSettingsStore from '@/store/modules/settings';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { useContextMenu } from '@/views/view/edit/hooks/useContextMenu.hook';
import { MenuOptionsItemType } from '@/views/view/edit/hooks/useContextMenu.hook.d';
import { LayerModeEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d';
import {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import LayersListItem from '../LayersListItem/index.vue';
import LayersStatus from '../LayersStatus/index.vue';

const props = defineProps({
  componentGroupData: {
    type: Object as PropType<CreateComponentGroupType>,
    required: true,
  },
  layerMode: {
    type: String as PropType<LayerModeEnum>,
    default: LayerModeEnum.THUMBNAIL,
  },
});

const settingsStore = useSettingsStore();
// 颜色
const themeColor = computed(() => {
  return settingsStore.theme;
});

const chartEditStore = useChartEditStore();
const { handleContextMenu, onClickOutSide } = useContextMenu();

const expend = ref(false);

// 是否选中文本
const selectText = computed(() => {
  return props.layerMode === LayerModeEnum.TEXT;
});

// 计算当前选中目标
const active = computed(() => {
  const id = props.componentGroupData.id;
  return chartEditStore.getTargetChart.selectId.find((e: string) => e === id);
});

// 组件状态 隐藏/锁定
const status = computed(() => {
  return props.componentGroupData.status;
});

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
    return filter([MenuEnum.GROUP]);
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
    return [
      ...filter([MenuEnum.UN_GROUP]),
      ...targetList.filter(i => !statusMenuEnums.includes(i.key as MenuEnum)),
    ];
  }
};

// 点击
const clickHandle = (e: MouseEvent) => {
  // 按下左键 + CTRL
  if (window.$KeyboardActive?.ctrl) return;
  // 判断左右键
  expend.value = !expend.value;
  mousedownHandle(e, props.componentGroupData);
};

// 组点击事件
const groupMousedownHandle = (e: MouseEvent) => {
  onClickOutSide();
  // 若此时按下了 CTRL, 表示多选
  const id = props.componentGroupData.id;
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

// 公共点击事件
const mousedownHandle = (
  e: MouseEvent,
  componentInstance: CreateComponentType | CreateComponentGroupType,
  id?: string,
) => {
  e.preventDefault();
  e.stopPropagation();

  onClickOutSide();
  chartEditStore.setTargetSelectChart(id || componentInstance.id);
};

// 公共进入事件
const mouseenterHandle = (
  componentInstance: CreateComponentType | CreateComponentGroupType,
) => {
  chartEditStore.setTargetHoverChart(componentInstance.id);
};

// 公共移出事件
const mouseleaveHandle = (
  componentInstance: CreateComponentType | CreateComponentGroupType,
) => {
  chartEditStore.setTargetHoverChart(undefined);
};
</script>

<style lang="scss" scoped>
.list-group-item {
  position: relative;
  .list-item {
    position: relative;
    margin-bottom: 4px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px dashed v-bind(themeColor);

    &.active {
      border-style: solid;
      &::after {
        content: '';
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.2;
        background-color: v-bind(themeColor);
      }
    }

    &.list-text {
      padding: 5px 0;

      .list-item-content {
        height: 20px !important;
        .el-icon {
          display: none;
        }
      }
    }
    .list-item-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
      .list-item-content {
        display: flex;
        align-items: center;
        width: 135px;
        height: 50px;
        .el-text {
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
