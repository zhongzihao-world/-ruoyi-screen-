import cloneDeep from 'lodash/cloneDeep';

import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public';
import { CreateComponentType } from '@/packages/index.d';
import { ScatterCommonConfig } from './index';
import dataset from './data.json';

export const includes = ['title', 'legend', 'xAxis', 'yAxis', 'grid'];
export const seriesItem = {
  type: 'scatter',
  emphasis: {
    focus: 'series',
  },
  symbolSize: 8,
  large: false,
  largeThreshold: 2000,
  itemStyle: {
    color: null,
  },
};
export const option = {
  title: {
    show: true,
  },
  tooltip: {
    show: true,
  },
  xAxis: {
    show: true,
  },
  yAxis: {
    show: true,
  },
  legend: {
    show: true,
  },
  dataset,
  series: dataset.map((item, index) => ({
    ...seriesItem,
    datasetIndex: index,
  })),
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public key = ScatterCommonConfig.key;
  public chartConfig = cloneDeep(ScatterCommonConfig);
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes);
}
