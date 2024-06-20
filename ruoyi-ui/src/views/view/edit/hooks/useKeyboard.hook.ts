import { onUnmounted } from 'vue';
import keymaster from 'keymaster';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { WinKeyboard, MenuEnum } from '@/enums/editPageEnum';

const chartEditStore = useChartEditStore();

const winCtrlMerge = (e: string) => `${WinKeyboard.CTRL}+${e}`;
const winShiftMerge = (e: string) => `${WinKeyboard.SHIFT}+${e}`;

export const winKeyboardValue = {
  [MenuEnum.ARROW_UP]: winCtrlMerge('up'),
  [MenuEnum.ARROW_RIGHT]: winCtrlMerge('right'),
  [MenuEnum.ARROW_DOWN]: winCtrlMerge('down'),
  [MenuEnum.ARROW_LEFT]: winCtrlMerge('left'),
  [MenuEnum.SAVE]: winCtrlMerge('s'),
  [MenuEnum.COPY]: winCtrlMerge('c'),
  [MenuEnum.CUT]: winCtrlMerge('x'),
  [MenuEnum.PARSE]: winCtrlMerge('v'),
  [MenuEnum.DELETE]: 'delete',
  [MenuEnum.BACK]: winCtrlMerge('z'),
  [MenuEnum.FORWORD]: winCtrlMerge(winShiftMerge('z')),
  [MenuEnum.GROUP]: winCtrlMerge('g'),
  [MenuEnum.UN_GROUP]: winCtrlMerge(winShiftMerge('g')),
  [MenuEnum.LOCK]: winCtrlMerge('l'),
  [MenuEnum.UNLOCK]: winCtrlMerge(winShiftMerge('l')),
  [MenuEnum.HIDE]: winCtrlMerge('h'),
  [MenuEnum.SHOW]: winCtrlMerge(winShiftMerge('h')),
};

// Win 快捷键列表
const winKeyList: Array<string> = [
  winKeyboardValue.up,
  winKeyboardValue.right,
  winKeyboardValue.down,
  winKeyboardValue.left,

  winKeyboardValue.save,
  winKeyboardValue.delete,
  winKeyboardValue.copy,
  winKeyboardValue.cut,
  winKeyboardValue.parse,

  winKeyboardValue.back,
  winKeyboardValue.forward,

  winKeyboardValue.group,
  winKeyboardValue.unGroup,

  winKeyboardValue.lock,
  winKeyboardValue.unLock,

  winKeyboardValue.hide,
  winKeyboardValue.show,
];

// 处理键盘记录
const keyRecordHandle = () => {
  // 默认赋值
  window.$KeyboardActive = {
    ctrl: false,
    space: false,
  };

  document.onkeydown = (e: KeyboardEvent) => {
    const { keyCode } = e;
    if (keyCode == 32 && e.target == document.body) e.preventDefault();

    if ([17, 32].includes(keyCode) && window.$KeyboardActive) {
      switch (keyCode) {
        case 17:
          window.$KeyboardActive.ctrl = true;
          break;
        case 32:
          window.$KeyboardActive.space = true;
          // 样式处理
          window.onKeySpacePressHold?.(true);
          break;
      }
    }
  };

  document.onkeyup = (e: KeyboardEvent) => {
    const { keyCode } = e;
    if (keyCode == 32 && e.target == document.body) e.preventDefault();

    if ([17, 32].includes(keyCode) && window.$KeyboardActive) {
      switch (keyCode) {
        case 17:
          window.$KeyboardActive.ctrl = false;
          break;
        case 32:
          window.$KeyboardActive.space = false;
          // 样式处理
          window.onKeySpacePressHold?.(false);
          break;
      }
    }
  };
};

// 初始化监听事件
export const useAddKeyboard = () => {
  const throttleTime = 50;
  const switchHandle = (keyboardValue: typeof winKeyboardValue, e: string) => {
    switch (e) {
      // ct+↑
      case keyboardValue.up:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setMove(MenuEnum.ARROW_UP);
            return false;
          }, throttleTime),
        );
        break;
      // ct+→
      case keyboardValue.right:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setMove(MenuEnum.ARROW_RIGHT);
            return false;
          }, throttleTime),
        );
        break;
      // ct+↓
      case keyboardValue.down:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setMove(MenuEnum.ARROW_DOWN);
            return false;
          }, throttleTime),
        );
        break;
      // ct+←
      case keyboardValue.left:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setMove(MenuEnum.ARROW_LEFT);
            return false;
          }, throttleTime),
        );
        break;

      // 删除 delete
      case keyboardValue.delete:
        keymaster(
          e,
          debounce(() => {
            chartEditStore.removeComponentList();
            return false;
          }, throttleTime),
        );
        break;

      // 保存 ct + s
      case keyboardValue.save:
        keymaster(
          e,
          debounce(() => {
            return false;
          }, throttleTime),
        );
        break;
      // 复制 ct+c
      case keyboardValue.copy:
        keymaster(
          e,
          debounce(() => {
            chartEditStore.setCopy();
            return false;
          }, throttleTime),
        );
        break;
      // 剪切 ct+x
      case keyboardValue.cut:
        keymaster(
          e,
          debounce(() => {
            chartEditStore.setCut();
            return false;
          }, throttleTime),
        );
        break;
      // 粘贴 ct+v
      case keyboardValue.parse:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setParse();
            return false;
          }, throttleTime),
        );
        break;

      // 撤回 ct+z
      case keyboardValue.back:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setBack();
            return false;
          }, throttleTime),
        );
        break;
      // 前进 ct+sh+z
      case keyboardValue.forward:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setForward();
            return false;
          }, throttleTime),
        );
        break;

      // 创建分组 ct+g
      case keyboardValue.group:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setGroup();
            return false;
          }, throttleTime),
        );
        break;
      // 解除分组 ct+sh+g
      case keyboardValue.unGroup:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setUnGroup();
            return false;
          }, throttleTime),
        );
        break;

      // 锁定 ct+l
      case keyboardValue.lock:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setLock();
            return false;
          }, throttleTime),
        );
        break;
      // 解除锁定 ct+sh+l
      case keyboardValue.unLock:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setUnLock();
            return false;
          }, throttleTime),
        );
        break;

      // 隐藏 ct+h
      case keyboardValue.hide:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setHide();
            return false;
          }, throttleTime),
        );
        break;
      // 解除隐藏 ct+sh+h
      case keyboardValue.show:
        keymaster(
          e,
          throttle(() => {
            chartEditStore.setShow();
            return false;
          }, throttleTime),
        );
        break;
    }
  };
  winKeyList.forEach((key: string) => {
    switchHandle(winKeyboardValue, key);
  });

  keyRecordHandle();
  onUnmounted(() => {
    useRemoveKeyboard();
  });
};

// 卸载监听事件
export const useRemoveKeyboard = () => {
  document.onkeydown = () => {};
  document.onkeyup = () => {};

  winKeyList.forEach((key: string) => {
    keymaster.unbind(key);
  });
};
