import cloneDeep from 'lodash/cloneDeep';

import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public';
import { CreateComponentType } from '@/packages/index.d';
import { LineCommonConfig } from './index';
import dataset from './data.json';

export const includes = ['title', 'legend', 'xAxis', 'yAxis', 'grid'];
export const seriesItem = {
  type: 'line',
  symbolSize: 8, // 实心点大小
  label: {
    show: true,
    color: '#ffffff',
    fontSize: 12,
  },
  itemStyle: {
    color: null,
    borderRadius: 0,
  },
  lineStyle: {
    type: 'solid',
    width: 2,
    color: null,
  },
};
export const option = {
  title: {
    show: true,
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      show: true,
      type: 'line',
    },
  },
  xAxis: {
    show: true,
    type: 'category',
  },
  yAxis: {
    show: true,
    type: 'value',
  },
  legend: {
    show: true,
  },
  dataset,
  series: [seriesItem, seriesItem],
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public key = LineCommonConfig.key;
  public chartConfig = cloneDeep(LineCommonConfig);
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes);
}
