import { defineStore } from 'pinia';

import { setLocalStorage, getLocalStorage } from '@/utils';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import {
  type ChartLayoutType,
  LayerModeEnum,
  ChartModeEnum,
} from './chartLayoutStore.d';

const chartEditStore = useChartEditStore();

const CHART_LAYOUT_SETTING_STORE = 'chart-layout-setting';
const storageChartLayout: ChartLayoutType = getLocalStorage(
  CHART_LAYOUT_SETTING_STORE,
);

export const useChartLayoutStore = defineStore({
  id: 'useChartLayoutStore',
  state: (): ChartLayoutType =>
    storageChartLayout || {
      // 图层面板
      layers: true,
      // 图表面板
      charts: true,
      // 详情面板
      details: true,
      // 是否重置当前画布位置
      rePositionCanvas: false,

      // 组件列表展示类型（默认单列）
      chartType: ChartModeEnum.SINGLE,
      // 图层类型（默认图片）
      layerType: LayerModeEnum.THUMBNAIL,
    },
  getters: {
    getLayers(): boolean {
      return this.layers;
    },
    getCharts(): boolean {
      return this.charts;
    },
    getDetails(): boolean {
      return this.details;
    },
    getRePositionCanvas(): boolean {
      return this.rePositionCanvas;
    },

    getChartType(): ChartModeEnum {
      return this.chartType;
    },
    getLayerType(): LayerModeEnum {
      return this.layerType;
    },
  },
  actions: {
    setItem<T extends keyof ChartLayoutType, K extends ChartLayoutType[T]>(
      key: T,
      value: K,
    ): void {
      this.$patch(state => {
        state[key] = value;
      });

      setLocalStorage(CHART_LAYOUT_SETTING_STORE, this.$state);
      // 重置画布位置
      this.rePositionCanvas = true;
      // 重新计算拖拽区域缩放比例
      setTimeout(() => {
        chartEditStore.computedScale();
      }, 300);
    },
    setItemUnHandle<
      T extends keyof ChartLayoutType,
      K extends ChartLayoutType[T],
    >(key: T, value: K): void {
      this.$patch(state => {
        state[key] = value;
      });
    },
  },
});
