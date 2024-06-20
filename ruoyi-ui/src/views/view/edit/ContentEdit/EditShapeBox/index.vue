<template>
  <div class="canvas-shape-box" :class="{ lock, hide }">
    <slot></slot>

    <template v-if="!hiddenPoint">
      <div
        class="shape-line-x"
        :class="{ selectActive: select, hoverActive: hover }"
      />
      <div
        class="shape-line-y"
        :class="{ selectActive: select, hoverActive: hover }"
      />

      <div
        :class="`shape-point ${point}`"
        v-for="(point, index) in select ? pointList : []"
        :key="index"
        :style="usePointStyle(point, index, item.attr, cursorResize)"
        @mousedown="useMousePointHandle($event, point, item.attr)"
      />
    </template>

    <div class="shape-modal" :style="useSizeStyle(item.attr)">
      <div class="shape-modal-select" :class="{ active: select }" />
      <div
        class="shape-modal-change"
        :class="{ selectActive: select, hoverActive: hover }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

import useSettingsStore from '@/store/modules/settings';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import { useSizeStyle, usePointStyle } from '../hooks/useStyle.hook';
import { useMousePointHandle } from '../hooks/useDrag.hook';

const props = defineProps({
  item: {
    type: Object as PropType<CreateComponentType | CreateComponentGroupType>,
    required: true,
  },
  hiddenPoint: {
    type: Boolean,
    required: false,
  },
});

const settingsStore = useSettingsStore();
const chartEditStore = useChartEditStore();

// 锚点
const pointList = ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb'];

// 光标朝向
const cursorResize = ['n', 'e', 's', 'w', 'nw', 'ne', 'sw', 'se'];

// 颜色
const themeColor = computed(() => {
  return settingsStore.theme;
});

// 计算当前选中目标
const hover = computed(() => {
  if (props.item.status.lock) return false;
  return props.item.id === chartEditStore.getTargetChart.hoverId;
});

// 兼容多值场景
const select = computed(() => {
  const id = props.item.id;
  if (props.item.status.lock) return false;
  return chartEditStore.getTargetChart.selectId.find((e: string) => e === id);
});

// 锁定
const lock = computed(() => {
  return props.item.status.lock;
});

// 隐藏
const hide = computed(() => {
  return props.item.status.hide;
});
</script>

<style lang="scss" scoped>
.canvas-shape-box {
  position: absolute;
  cursor: move;

  &.lock {
    cursor: default !important;
  }

  &.hide {
    display: none;
  }

  .shape-line-x {
    border-top: 1px dashed;
    width: 100%;
    left: 0px;
  }

  .shape-line-y {
    border-right: 1px dashed;
    height: 100%;
    top: 0px;
  }

  .shape-line-x,
  .shape-line-y {
    position: fixed;
    display: none;
    border-color: v-bind('themeColor');

    &.selectActive,
    &.hoverActive {
      display: block;
    }
  }

  .shape-point {
    z-index: 1;
    position: absolute;
    width: 7px;
    height: 7px;
    border: 3px solid v-bind('themeColor');
    border-radius: 5px;
    background-color: #fff;
    transform: translate(-40%, -30%);
    &.t {
      width: 30px;
      transform: translate(-50%, -50%);
    }
    &.b {
      width: 30px;
      transform: translate(-50%, -30%);
    }
    &.l,
    &.r {
      height: 30px;
    }
    &.r {
      transform: translate(-20%, -50%);
    }
    &.l {
      transform: translate(-45%, -50%);
    }
    &.rt,
    &.rb {
      transform: translate(-30%, -30%);
    }
  }
  .shape-modal {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;

    .shape-modal-select,
    .shape-modal-change {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .shape-modal-select {
      opacity: 0.1;
      top: 2px;
      left: 2px;
      &.active {
        background-color: v-bind('themeColor');
      }
    }
    .shape-modal-change {
      border: 2px solid rgba(0, 0, 0, 0);
      &.selectActive,
      &.hoverActive {
        border-color: v-bind('themeColor');
        border-width: 2px;
      }
      &.hoverActive {
        border-style: dotted;
      }
      &.selectActive {
        border-style: solid;
      }
    }
  }
}
</style>
