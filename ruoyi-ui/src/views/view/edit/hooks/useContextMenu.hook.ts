import { ref, nextTick, toRaw } from 'vue';
import cloneDeep from 'lodash/cloneDeep';

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import { loadingError } from '@/utils';
import { MenuEnum } from '@/enums/editPageEnum';
import { MenuOptionsItemType } from './useContextMenu.hook.d';

const chartEditStore = useChartEditStore();

// 单组件
export const defaultOptions: MenuOptionsItemType[] = [
  {
    label: '锁定',
    key: MenuEnum.LOCK,
    icon: 'Lock',
    fnHandle: chartEditStore.setLock,
  },
  {
    label: '解锁',
    key: MenuEnum.UNLOCK,
    icon: 'Unlock',
    fnHandle: chartEditStore.setUnLock,
  },
  {
    label: '隐藏',
    key: MenuEnum.HIDE,
    icon: 'Hide',
    fnHandle: chartEditStore.setHide,
  },
  {
    label: '显示',
    key: MenuEnum.SHOW,
    icon: 'View',
    fnHandle: chartEditStore.setShow,
  },
  {
    type: 'divider',
    key: 'divider-1',
  },

  {
    label: '复制',
    key: MenuEnum.COPY,
    icon: 'CopyDocument',
    fnHandle: chartEditStore.setCopy,
  },
  {
    label: '粘贴',
    key: MenuEnum.PARSE,
    icon: 'Scissor',
    fnHandle: chartEditStore.setParse,
  },
  {
    type: 'divider',
    key: 'divider-2',
  },

  {
    label: '置顶',
    key: MenuEnum.TOP,
    icon: 'Upload',
    fnHandle: chartEditStore.setTop,
  },
  {
    label: '置底',
    key: MenuEnum.BOTTOM,
    icon: 'Download',
    fnHandle: chartEditStore.setBottom,
  },
  {
    type: 'divider',
    key: 'divider-3',
  },

  {
    label: '删除',
    key: MenuEnum.DELETE,
    icon: 'Delete',
    type: 'error',
    fnHandle: chartEditStore.removeComponentList,
  },
];
// 组合组件
export const defaultMultiSelectOptions: MenuOptionsItemType[] = [
  {
    label: '创建分组',
    key: MenuEnum.GROUP,
    icon: 'Plus',
    fnHandle: chartEditStore.setGroup,
  },
  {
    label: '解除分组',
    key: MenuEnum.UN_GROUP,
    icon: 'Minus',
    fnHandle: chartEditStore.setUnGroup,
  },
  {
    type: 'divider',
    key: 'divider-3',
  },
];
// 画布
const canvasOptions = [
  {
    label: '粘贴',
    key: MenuEnum.PARSE,
    icon: 'Scissor',
    fnHandle: chartEditStore.setParse,
  },
  {
    label: '清空画布',
    key: MenuEnum.CLEAR_ALL,
    icon: 'Close',
    fnHandle: chartEditStore.clearComponentList,
  },
];

// 右键选项
const menuOptions = ref<MenuOptionsItemType[]>([]);

/**
 * 右键事件处理
 * 单组件、组合组件、画布
 * @param e
 * @param targetInstance
 * @param optionsHandle
 */
const handleContextMenu = (
  e: MouseEvent,
  // 右键对象
  targetInstance?: CreateComponentType | CreateComponentGroupType,
  // 判断函数
  optionsHandle?: Function,
) => {
  e.stopPropagation();
  e.preventDefault();

  let target = e.target;
  while (target instanceof SVGElement) {
    target = target.parentNode;
  }

  // 设置选中
  chartEditStore.setTargetSelectChart(targetInstance && targetInstance.id);
  // 隐藏
  chartEditStore.setRightMenuShow(false);

  if (chartEditStore.getTargetChart.selectId.length > 1) {
    // 组合组件
    menuOptions.value = defaultMultiSelectOptions;
  } else {
    // 单组件
    menuOptions.value = defaultOptions;
  }
  // 对选项进行过滤处理
  if (optionsHandle) {
    menuOptions.value = optionsHandle(
      cloneDeep(toRaw(menuOptions.value)), // 当前右键菜单
      [...defaultMultiSelectOptions, ...defaultOptions], // 所有右键菜单
      targetInstance, // 单组件、组合组件
    );
  }

  // 画布
  if (!targetInstance) {
    menuOptions.value = canvasOptions;
  }

  nextTick(() => {
    // 显示
    chartEditStore.setMousePosition(e.clientX, e.clientY);
    chartEditStore.setRightMenuShow(true);
  });
};

/**
 * 右键 hook
 * @param menuConfig
 * @returns
 */
export const useContextMenu = () => {
  // 隐藏
  const onClickOutSide = () => {
    chartEditStore.setRightMenuShow(false);
  };

  // 执行右键操作
  const handleMenuSelect = (key: string) => {
    chartEditStore.setRightMenuShow(false);
    const targetItem: MenuOptionsItemType[] = menuOptions.value.filter(
      (e: MenuOptionsItemType) => e.key === key,
    );

    menuOptions.value.forEach((e: MenuOptionsItemType) => {
      if (e.key === key) {
        if (e.fnHandle) {
          e.fnHandle();
          return;
        }
        if (!targetItem) loadingError();
      }
    });
  };

  return {
    menuOptions,
    defaultOptions,
    defaultMultiSelectOptions,
    handleContextMenu,
    onClickOutSide,
    handleMenuSelect,
    mousePosition: chartEditStore.getMousePosition,
  };
};
