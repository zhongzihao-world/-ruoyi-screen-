export enum ChartLayoutStoreEnum {
  LAYERS = 'layers',
  CHARTS = 'charts',
  DETAILS = 'details',
  RE_POSITION_CANVAS = 'rePositionCanvas',

  Chart_TYPE = 'chartType',
  LAYER_TYPE = 'layerType',
}

export enum ChartModeEnum {
  SINGLE = 'single',
  DOUBLE = 'double',
}

export enum LayerModeEnum {
  THUMBNAIL = 'thumbnail',
  TEXT = 'text',
}
export interface ChartLayoutType {
  [ChartLayoutStoreEnum.LAYERS]: boolean;
  [ChartLayoutStoreEnum.CHARTS]: boolean;
  [ChartLayoutStoreEnum.DETAILS]: boolean;
  [ChartLayoutStoreEnum.RE_POSITION_CANVAS]: boolean;

  // 组件展示方式
  [ChartLayoutStoreEnum.Chart_TYPE]: ChartModeEnum;
  // 层级展示方式
  [ChartLayoutStoreEnum.LAYER_TYPE]: LayerModeEnum;
}
