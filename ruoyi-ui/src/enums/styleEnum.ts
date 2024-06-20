// 预览展示
export enum PreviewScaleEnum {
  FIT = 'fit',
  SCROLL_Y = 'scrollY',
  SCROLL_X = 'scrollX',
  FULL = 'full',
}

export const FitTypeEnum = [
  {
    value: 'none',
    label: '默认',
    desc: '保持原有尺寸、比例',
  },
  {
    value: 'contain',
    label: '缩放',
    desc: '保持原有尺寸比例，内容被缩放',
  },
  {
    value: 'cover',
    label: '裁切',
    desc: '保持原有尺寸比例，内容可能被裁切',
  },
  {
    value: 'fill',
    label: '拉伸',
    desc: '不保持原有比例，内容拉伸填充整个容器',
  },
];

export const DirectionEnum = [
  {
    value: 'horizontal',
    label: '水平',
    desc: '',
  },
  {
    value: 'vertical',
    label: '垂直',
    desc: '',
  },
];

