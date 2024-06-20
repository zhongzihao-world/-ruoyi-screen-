import type { StyleValue } from 'vue';

import { PickCreateComponentType } from '@/packages/index.d';
import { EditCanvasConfigType } from '@/store/modules/chartEditStore/chartEditStore.d';

type AttrType = PickCreateComponentType<'attr'>;
type StylesType = PickCreateComponentType<'styles'>;
type StatusType = PickCreateComponentType<'status'>;
type PreviewConfig = PickCreateComponentType<'preview'>;

// 设置位置
export const getComponentAttrStyle = (attr: AttrType, index: number) => {
  const componentStyle = {
    zIndex: index + 1,
    left: `${attr.x}px`,
    top: `${attr.y}px`,
  };
  return componentStyle;
};

// 设置大小
export const getSizeStyle = (attr: AttrType, scale?: number) => {
  return {
    width: `${scale ? scale * attr.w : attr.w}px`,
    height: `${scale ? scale * attr.h : attr.h}px`,
  };
};

// css 样式
export const getCssStyle = (styles: StylesType) => {
  const {
    opacity,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  } = styles;
  return {
    opacity: opacity / 100,
    padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
  };
};

// 设置状态样式
export const getStatusStyle = (attr: StatusType) => {
  return {
    display: attr.hide ? 'none' : 'block',
  };
};

// 设置预览配置样式
export const getPreviewConfigStyle = (previewConfig: PreviewConfig) => {
  const previewStyle: StyleValue = {};
  if (previewConfig) {
    if (previewConfig.overFlowHidden) {
      previewStyle.overflow = 'hidden';
    }
  }
  return previewStyle;
};

// 全局样式
export const getEditCanvasConfigStyle = (canvas: EditCanvasConfigType) => {
  // 背景
  const computedBackground = canvas.selectColor
    ? { background: canvas.background }
    : {
        background: `url(${canvas.backgroundImage}) center center / cover no-repeat !important`,
      };
  return {
    position: 'relative' as const,
    width: canvas.width ? `${canvas.width || 100}px` : '100%',
    height: canvas.height ? `${canvas.height}px` : '100%',
    ...computedBackground,
  };
};
