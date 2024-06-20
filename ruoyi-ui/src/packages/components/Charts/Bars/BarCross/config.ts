import cloneDeep from 'lodash/cloneDeep';

import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public';
import { CreateComponentType } from '@/packages/index.d';
import { BarCrossConfig } from './index';
import dataset from './data.json';

export const includes = ['title', 'legend', 'xAxis', 'yAxis', 'grid'];
export const seriesItem = {
  type: 'bar',
  barWidth: null,
  label: {
    show: true,
    position: 'right',
    color: '#ffffff',
    fontSize: 12,
  },
  itemStyle: {
    color: null,
    borderRadius: 0,
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
      type: 'shadow',
    },
  },
  xAxis: {
    show: true,
    type: 'value',
  },
  yAxis: {
    show: true,
    type: 'category',
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
  public key = BarCrossConfig.key;
  public chartConfig = cloneDeep(BarCrossConfig);
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes);
}
