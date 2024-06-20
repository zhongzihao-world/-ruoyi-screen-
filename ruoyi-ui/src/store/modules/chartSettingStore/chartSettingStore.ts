import { defineStore } from 'pinia';

import type { ChartSettingStore } from './chartSettingStore.d';

export const useChartSettingStore = defineStore({
  id: 'useChartSettingStore',
  state: (): ChartSettingStore => {
    return {
      chartMoveDistance: 5,
      chartAlignRange: 5,
    };
  },
  getters: {
    getChartMoveDistance(): number {
      return this.chartMoveDistance;
    },
    getChartAlignRange(): number {
      return this.chartAlignRange;
    },
  },
  actions: {
    setItem<T extends keyof ChartSettingStore, K extends ChartSettingStore[T]>(
      key: T,
      value: K,
    ): void {
      this.$patch(state => {
        state[key] = value;
      });
    },
  },
});
