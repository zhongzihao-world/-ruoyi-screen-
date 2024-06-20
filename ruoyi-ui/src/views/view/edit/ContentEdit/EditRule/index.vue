<template>
  <div class="canvas-main">
    <SketchRule
      v-if="isShowSketch"
      class="canvas-sketch"
      :thick="thick"
      :scale="scale"
      :width="canvasBox().width"
      :height="canvasBox().height"
      :startX="startX"
      :startY="startY"
      :lines="lines"
    />

    <div ref="canvasWrapRef" class="canvas-wrap" @scroll="handleScroll">
      <div
        ref="canvasModelRef"
        class="canvas-model"
        :style="{ width: width * 1 + 'px', height: height * 1 + 'px' }"
      >
        <div ref="canvasPanelRef" class="canvas-panel" @mousedown="dragCanvas">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  toRefs,
  watch,
  onUnmounted,
  computed,
} from 'vue';
import { listen } from 'dom-helpers';
import throttle from 'lodash/throttle';
import { SketchRule } from 'vue3-sketch-ruler';

import useSettingsStore from '@/store/modules/settings';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore';
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d';

const settingsStore = useSettingsStore();
const chartEditStore = useChartEditStore();
const chartLayoutStore = useChartLayoutStore();

const canvasWrapRef = ref();
const canvasPanelRef = ref();
const canvasModelRef = ref();
// 大屏宽、高
const { width, height } = toRefs(chartEditStore.getEditCanvasConfig);

const thick = 20;
// 刻度值起始位置
const startX = ref(0);
const startY = ref(0);
// 鼠标开始位置
let prevMoveXValue = [0, 0];
let prevMoveYValue = [0, 0];
// 辅助线
const lines = reactive({ h: [], v: [] });

// 鼠标样式
const isPressSpace = ref(false);
const cursorStyle = ref('auto');

// 颜色
const themeColor = computed(() => {
  return settingsStore.theme;
});

// 缩放比例
const scale = computed(() => {
  return chartEditStore.getEditCanvas.scale;
});

// 鼠标滚轮缩放
const handleWheel = (e: any) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();

    let resScale = scale.value;
    // 放大
    if (e.wheelDelta >= 0 && scale.value < 1) {
      resScale = scale.value + 0.05;
      chartEditStore.setScale(resScale);
      return;
    }
    // 缩小
    if (e.wheelDelta < 0 && scale.value > 0.1) {
      resScale = scale.value - 0.05;
      chartEditStore.setScale(resScale);
      return;
    }
  }
};

// 滚动条处理
const handleScroll = () => {
  if (!canvasWrapRef.value) return;
  const screensRect = canvasWrapRef.value.getBoundingClientRect();
  const canvasRect = canvasPanelRef.value.getBoundingClientRect();
  // 标尺开始的刻度
  startX.value = (screensRect.left + thick - canvasRect.left) / scale.value;
  startY.value = (screensRect.top + thick - canvasRect.top) / scale.value;
};

// 拖拽处理
const dragCanvas = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (!window.$KeyboardActive?.space) return;
  // @ts-ignore
  document.activeElement?.blur();

  const startX = e.pageX;
  const startY = e.pageY;

  const listenMousemove = listen(window, 'mousemove', (e: MouseEvent) => {
    // 移动距离
    const nx = e.pageX - startX;
    const ny = e.pageY - startY;
    // 初始位置
    const [prevMoveX1, prevMoveX2] = prevMoveXValue;
    const [prevMoveY1, prevMoveY2] = prevMoveYValue;
    // 更新初始位置
    prevMoveXValue = [prevMoveX2, nx];
    prevMoveYValue = [prevMoveY2, ny];

    canvasWrapRef.value.scrollLeft -= 
      prevMoveX2 > prevMoveX1
        ? Math.abs(prevMoveX2 - prevMoveX1)
        : -Math.abs(prevMoveX2 - prevMoveX1);
    canvasWrapRef.value.scrollTop -=
      prevMoveY2 > prevMoveY1
        ? Math.abs(prevMoveY2 - prevMoveY1)
        : -Math.abs(prevMoveY2 - prevMoveY1);
  });

  const listenMouseup = listen(window, 'mouseup', () => {
    listenMousemove();
    listenMouseup();
    prevMoveXValue = [0, 0];
    prevMoveYValue = [0, 0];
    isPressSpace.value = false;
  });
};

// 计算画布大小
const canvasBox = () => {
  const layoutDom = document.getElementById('canvas-layout');
  if (layoutDom) {
    return {
      height: layoutDom.clientHeight - 25,
      width: layoutDom.clientWidth,
    };
  }
  return {
    width: width.value,
    height: height.value,
  };
};

// 重绘标尺
const isShowSketch = ref(true);
const reDraw = () => {
  isShowSketch.value = false;
  setTimeout(() => {
    isShowSketch.value = true;
  }, 10);
};

// 滚动居中
const canvasPosCenter = () => {
  const { width: containerWidth, height: containerHeight } =
    canvasModelRef.value.getBoundingClientRect();
  const { width, height } = canvasBox();

  canvasWrapRef.value.scrollLeft = containerWidth / 2 - width / 2;
  canvasWrapRef.value.scrollTop = containerHeight / 2 - height / 2;
};

// 处理标尺重制大小
watch(
  () => scale.value,
  (newValue, oldValue) => {
    if (oldValue !== newValue && chartLayoutStore.getRePositionCanvas) {
      chartLayoutStore.setItemUnHandle(
        ChartLayoutStoreEnum.RE_POSITION_CANVAS,
        false,
      );
      handleScroll();
      setTimeout(() => {
        canvasPosCenter();
        reDraw();
      }, 100);
    } else {
      throttle(reDraw, 20);
    }
  },
);

// 处理鼠标样式
window.onKeySpacePressHold = (isHold: boolean) => {
  isPressSpace.value = isHold;
};
watch(
  () => isPressSpace.value,
  newValue => {
    cursorStyle.value = newValue ? 'grab' : 'auto';
  },
);

onMounted(() => {
  if (canvasWrapRef.value) {
    canvasWrapRef.value.addEventListener('wheel', handleWheel, {
      passive: false,
    });
    canvasPosCenter();
  }
});

onUnmounted(() => {
  if (canvasWrapRef.value) {
    canvasWrapRef.value.removeEventListener('wheel', handleWheel);
  }
});
</script>

<style lang="scss" scoped>
.canvas-main {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: calc(100% - 40px);

  :deep(.canvas-sketch) {
    /* 横线 */
    .v-container .lines .line {
      /* 最大缩放 200% */
      width: 200vw !important;
      border-top: 1px solid v-bind('themeColor') !important;
    }

    .v-container .indicator {
      border-bottom: 1px solid v-bind('themeColor') !important;
    }

    /* 竖线 */
    .h-container .lines .line {
      /* 最大缩放 200% */
      height: 200vh !important;
      border-left: 1px solid v-bind('themeColor') !important;
    }

    .h-container .indicator {
      border-left: 1px solid v-bind('themeColor') !important;
    }

    /* 坐标数值背景颜色 */
    .indicator .value {
      background-color: rgba(0, 0, 0, 0);
    }

    /* 删除按钮 */
    .line .del {
      padding: 0;
      color: v-bind('themeColor');
      font-size: 26px;
      font-weight: bolder;
    }

    .corner {
      border: 0 !important;
    }
  }

  .canvas-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: auto;

    .canvas-model {
      position: absolute;
      top: 0;
      left: 0;
      .canvas-panel {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        &:hover {
          cursor: v-bind('cursorStyle');
        }
      }
    }
  }
}
</style>
