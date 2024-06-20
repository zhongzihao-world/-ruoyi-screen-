import { PickCreateComponentType } from '@/packages/index.d';

type AttrType = PickCreateComponentType<'attr'>;
type StylesType = PickCreateComponentType<'styles'>;

// 位置、层级
export const useComponentStyle = (attr: AttrType, index: number) => {
  if (!attr) return {};
  const componentStyle = {
    zIndex: index + 1,
    left: `${attr.x}px`,
    top: `${attr.y}px`,
  };
  return componentStyle;
};

// 宽高
export const useSizeStyle = (attr: AttrType, scale?: number) => {
  if (!attr) return {};
  return {
    width: `${scale ? scale * attr.w : attr.w}px`,
    height: `${scale ? scale * attr.h : attr.h}px`,
  };
};

// css 样式
export const useCssStyle = (styles: StylesType) => {
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

// 锚点位置
export const usePointStyle = (
  point: string,
  index: number,
  attr: PickCreateComponentType<'attr'>,
  cursorResize: string[],
) => {
  const { w: width, h: height } = attr;

  const isTop = /t/.test(point);
  const isBottom = /b/.test(point);
  const isLeft = /l/.test(point);
  const isRight = /r/.test(point);

  let newLeft = 0;
  let newTop = 0;

  // 四个角的点
  if (point.length === 2) {
    newLeft = isLeft ? 0 : width;
    newTop = isTop ? 0 : height;
  } else {
    // 上下两点的点，宽度居中
    if (isTop || isBottom) {
      newLeft = width / 2;
      newTop = isTop ? 0 : height;
    }

    // 左右两边的点，高度居中
    if (isLeft || isRight) {
      newLeft = isLeft ? 0 : width;
      newTop = Math.floor(height / 2);
    }
  }

  const style = {
    left: `${newLeft}px`,
    top: `${newTop}px`,
    cursor: cursorResize[index] + '-resize',
  };

  return style;
};
