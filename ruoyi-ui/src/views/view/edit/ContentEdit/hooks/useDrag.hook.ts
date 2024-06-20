import { toRaw } from 'vue';
import { throttle, cloneDeep } from 'lodash';

import { DragKeyEnum, MouseEventButton } from '@/enums/editPageEnum';
import { createComponent } from '@/packages';
import { ConfigType } from '@/packages/index.d';
import {
  CreateComponentType,
  CreateComponentGroupType,
  PickCreateComponentType,
} from '@/packages/index.d';
import { useContextMenu } from '@/views/view/edit/hooks/useContextMenu.hook';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { EditCanvasTypeEnum } from '@/store/modules/chartEditStore/chartEditStore.d';
import {
  loadingStart,
  loadingFinish,
  loadingError,
  setComponentPosition,
  JSONParse,
} from '@/utils';

const chartEditStore = useChartEditStore();
const { onClickOutSide } = useContextMenu();

// 拖拽到编辑区域里
export const dragHandle = async (e: DragEvent) => {
  e.preventDefault();

  try {
    loadingStart();

    // 获取拖拽数据
    const drayDataString = e!.dataTransfer!.getData(DragKeyEnum.DRAG_KEY);
    if (!drayDataString) {
      return;
    }

    // 修改状态
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, false);
    const dropData: Exclude<ConfigType, ['image']> = JSONParse(drayDataString);

    // 创建新图表组件
    let newComponent: CreateComponentType = await createComponent(dropData);

    setComponentPosition(
      newComponent,
      e.offsetX - newComponent.attr.w / 2,
      e.offsetY - newComponent.attr.h / 2,
    );
    chartEditStore.addComponentList(newComponent, false, true);
    chartEditStore.setTargetSelectChart(newComponent.id);
  } catch (error) {
    console.log(error);
    loadingError();
  } finally {
    loadingFinish();
  }
};

// 进入拖拽区域
export const dragoverHandle = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
};

// 不拦截默认行为点击
export const mousedownHandleUnStop = () => {
  chartEditStore.setTargetSelectChart(undefined);
};

// 鼠标框选
export const mousedownBoxSelect = (e: MouseEvent) => {
  if (e.which == 2) return;
  if (window.$KeyboardActive?.space) return;

  mousedownHandleUnStop();

  // 记录点击初始位置
  const startOffsetX = e.offsetX;
  const startOffsetY = e.offsetY;
  const startScreenX = e.screenX;
  const startScreenY = e.screenY;

  // 记录缩放
  const scale = chartEditStore.getEditCanvas.scale;

  chartEditStore.setMousePosition(
    undefined,
    undefined,
    startOffsetX,
    startOffsetY,
  );

  // 移动框选
  const mousemove = throttle((moveEvent: MouseEvent) => {
    // 取消当前选中
    chartEditStore.setTargetSelectChart();
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_SELECT, true);

    // 这里先把相对值算好，不然组件无法获取 startScreenX 和 startScreenY 的值
    const currX = startOffsetX + moveEvent.screenX - startScreenX;
    const currY = startOffsetY + moveEvent.screenY - startScreenY;
    chartEditStore.setMousePosition(currX, currY);

    // 计算框选的左上角和右下角
    const selectAttr = {
      // 左上角
      x1: 0,
      y1: 0,
      // 右下角
      x2: 0,
      y2: 0,
    };
    if (currX > startOffsetX && currY > startOffsetY) {
      // 右下方向
      selectAttr.x1 = startOffsetX;
      selectAttr.y1 = startOffsetY;
      selectAttr.x2 = Math.round(
        startOffsetX + (moveEvent.screenX - startScreenX) / scale,
      );
      selectAttr.y2 = Math.round(
        startOffsetY + (moveEvent.screenY - startScreenY) / scale,
      );
    } else if (currX > startOffsetX && currY < startOffsetY) {
      // 右上方向
      selectAttr.x1 = startOffsetX;
      selectAttr.y1 = Math.round(
        startOffsetY - (startScreenY - moveEvent.screenY) / scale,
      );
      selectAttr.x2 = Math.round(
        startOffsetX + (moveEvent.screenX - startScreenX) / scale,
      );
      selectAttr.y2 = startOffsetY;
    } else if (currX < startOffsetX && currY > startOffsetY) {
      selectAttr.x1 = Math.round(
        startOffsetX - (startScreenX - moveEvent.screenX) / scale,
      );
      selectAttr.y1 = startOffsetY;
      selectAttr.x2 = startOffsetX;
      selectAttr.y2 = Math.round(
        startOffsetY + (moveEvent.screenY - startScreenY) / scale,
      );
      // 左下方向
    } else {
      // 左上方向
      selectAttr.x1 = Math.round(
        startOffsetX - (startScreenX - moveEvent.screenX) / scale,
      );
      selectAttr.y1 = Math.round(
        startOffsetY - (startScreenY - moveEvent.screenY) / scale,
      );
      selectAttr.x2 = startOffsetX;
      selectAttr.y2 = startOffsetY;
    }

    // 遍历组件
    chartEditStore.getComponentList.forEach(item => {
      if (!chartEditStore.getTargetChart.selectId.includes(item.id)) {
        // 处理左上角
        const { x, y, w, h } = item.attr;
        const targetAttr = {
          // 左上角
          x1: x,
          y1: y,
          // 右下角
          x2: x + w,
          y2: y + h,
        };
        // 全包含则选中
        if (
          targetAttr.x1 - selectAttr.x1 >= 0 &&
          targetAttr.y1 - selectAttr.y1 >= 0 &&
          targetAttr.x2 - selectAttr.x2 <= 0 &&
          targetAttr.y2 - selectAttr.y2 <= 0 &&
          !item.status.lock &&
          !item.status.hide
        ) {
          chartEditStore.setTargetSelectChart(item.id, true);
        }
      }
    });
  }, 30);

  // 鼠标抬起
  const mouseup = () => {
    // 鼠标抬起时，结束mousemove的节流函数，避免选框不消失问题
    mousemove.cancel();
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_SELECT, false);
    chartEditStore.setMousePosition(0, 0, 0, 0);
    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
  };
  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
};

// 鼠标事件
export const useMouseHandle = () => {
  // click 事件
  const mouseClickHandle = (
    e: MouseEvent,
    item: CreateComponentType | CreateComponentGroupType,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.status.lock) return;
    // 若此时按下了 CTRL, 表示多选
    if (window.$KeyboardActive?.ctrl) {
      // 若已选中，则去除
      if (chartEditStore.targetChart.selectId.includes(item.id)) {
        const exList = chartEditStore.targetChart.selectId.filter(
          e => e !== item.id,
        );
        chartEditStore.setTargetSelectChart(exList);
      } else {
        chartEditStore.setTargetSelectChart(item.id, true);
      }
    }
  };

  // 进入事件
  const mouseenterHandle = (
    e: MouseEvent,
    item: CreateComponentType | CreateComponentGroupType,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!chartEditStore.getEditCanvas.isSelect) {
      chartEditStore.setTargetHoverChart(item.id);
    }
  };
  // 移出事件
  const mouseleaveHandle = (
    e: MouseEvent,
    item: CreateComponentType | CreateComponentGroupType,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, false);
    chartEditStore.setTargetHoverChart(undefined);
  };

  // 按下事件
  const mousedownHandle = (
    e: MouseEvent,
    item: CreateComponentType | CreateComponentGroupType,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.status.lock) return;

    // 隐藏右键菜单
    onClickOutSide();

    // 按下左键 + CTRL
    if (e.buttons === MouseEventButton.LEFT && window.$KeyboardActive?.ctrl) {
      return;
    }

    // 按下右键 + 选中多个 + 目标元素是多选子元素
    const selectId = chartEditStore.getTargetChart.selectId;
    if (
      e.buttons === MouseEventButton.RIGHT &&
      selectId.length > 1 &&
      selectId.includes(item.id)
    ) {
      return;
    }

    // 选中当前目标组件
    chartEditStore.setTargetSelectChart(item.id);

    // 按下右键
    if (e.buttons === MouseEventButton.RIGHT) return;

    const scale = chartEditStore.getEditCanvas.scale;
    const canvasWidth = chartEditStore.getEditCanvasConfig.width;
    const canvasHeight = chartEditStore.getEditCanvasConfig.height;

    // 记录图表初始位置和大小
    const targetMap = new Map();
    chartEditStore.getTargetChart.selectId.forEach(id => {
      const index = chartEditStore.fetchTargetIndex(id);
      if (index !== -1) {
        const { x, y, w, h } = toRaw(
          chartEditStore.getComponentList[index],
        ).attr;
        targetMap.set(id, { x, y, w, h });
      }
    });

    // 记录点击初始位置
    const startX = e.screenX;
    const startY = e.screenY;

    // 记录历史位置
    let prevComponentInstance: Array<
      CreateComponentType | CreateComponentGroupType
    > = [];
    chartEditStore.getTargetChart.selectId.forEach(id => {
      if (!targetMap.has(id)) return;

      const index = chartEditStore.fetchTargetIndex(id);
      // 拿到初始位置数据
      prevComponentInstance.push(
        cloneDeep(chartEditStore.getComponentList[index]),
      );
    });

    // 记录初始位置
    chartEditStore.setMousePosition(undefined, undefined, startX, startY);

    // 移动-计算偏移量
    const mousemove = throttle((moveEvent: MouseEvent) => {
      chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, true);
      chartEditStore.setMousePosition(moveEvent.screenX, moveEvent.screenY);

      // 当前偏移量，处理 scale 比例问题
      let offsetX = (moveEvent.screenX - startX) / scale;
      let offsetY = (moveEvent.screenY - startY) / scale;

      chartEditStore.getTargetChart.selectId.forEach(id => {
        if (!targetMap.has(id)) return;

        const index = chartEditStore.fetchTargetIndex(id);
        // 拿到初始位置数据
        const { x, y, w, h } = targetMap.get(id);
        const componentInstance = chartEditStore.getComponentList[index];

        let currX = Math.round(x + offsetX);
        let currY = Math.round(y + offsetY);

        // 要预留的距离
        const distance = 2;

        // 左上角越界检测
        currX = currX < 0 ? 0 : currX;
        currY = currY < 0 ? 0 : currY;

        // 右下角越界检测
        currX = currX > canvasWidth - w ? canvasWidth - w : currX;
        currY =
          currY > canvasHeight - h ? canvasHeight - h : currY;
        if (componentInstance) {
          componentInstance.attr = Object.assign(componentInstance.attr, {
            x: currX,
            y: currY,
          });
        }
      });
      return;
    }, 20);

    const mouseup = () => {
      try {
        chartEditStore.setMousePosition(0, 0, 0, 0);
        chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, false);
        // 加入历史栈
        if (prevComponentInstance.length) {
          chartEditStore.getTargetChart.selectId.forEach(id => {
            if (!targetMap.has(id)) return;
            const index = chartEditStore.fetchTargetIndex(id);
            const curComponentInstance = chartEditStore.getComponentList[index];
            // 找到记录的所选组件
            prevComponentInstance.forEach(preItem => {
              if (preItem.id === id) {
                preItem.attr = Object.assign(preItem.attr, {
                  offsetX: curComponentInstance.attr.x - preItem.attr.x,
                  offsetY: curComponentInstance.attr.y - preItem.attr.y,
                });
              }
            });
          });
          chartEditStore.moveComponentList(prevComponentInstance);
        }
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      } catch (err) {
        console.log(err);
      }
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };

  return {
    mouseClickHandle,
    mouseenterHandle,
    mouseleaveHandle,
    mousedownHandle,
  };
};

// 鼠标锚点处理
export const useMousePointHandle = (
  e: MouseEvent,
  point: string,
  attr: PickCreateComponentType<'attr'>,
) => {
  e.stopPropagation();
  e.preventDefault();

  // 设置拖拽状态
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, true);
  const scale = chartEditStore.getEditCanvas.scale;

  const itemAttrX = attr.x;
  const itemAttrY = attr.y;
  const itemAttrW = attr.w;
  const itemAttrH = attr.h;

  // 记录点击初始位置
  const startX = e.screenX;
  const startY = e.screenY;

  // 记录初始位置
  chartEditStore.setMousePosition(startX, startY);

  const mousemove = throttle((moveEvent: MouseEvent) => {
    chartEditStore.setMousePosition(moveEvent.screenX, moveEvent.screenY);

    let currX = Math.round((moveEvent.screenX - startX) / scale);
    let currY = Math.round((moveEvent.screenY - startY) / scale);

    const isTop = /t/.test(point);
    const isBottom = /b/.test(point);
    const isLeft = /l/.test(point);
    const isRight = /r/.test(point);

    const newHeight = itemAttrH + (isTop ? -currY : isBottom ? currY : 0);
    const newWidth = itemAttrW + (isLeft ? -currX : isRight ? currX : 0);

    attr.h = newHeight > 0 ? newHeight : 0;
    attr.w = newWidth > 0 ? newWidth : 0;
    attr.x = itemAttrX + (isLeft ? currX : 0);
    attr.y = itemAttrY + (isTop ? currY : 0);
  }, 50);

  const mouseup = () => {
    chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_DRAG, false);
    chartEditStore.setMousePosition(0, 0, 0, 0);
    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
  };

  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
};
