import cloneDeep from 'lodash/cloneDeep';

import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public';
import { CreateComponentType } from '@/packages/index.d';
import { BarCommonConfig } from './index';
import dataset from './data.json';

export const includes = ['title', 'legend', 'xAxis', 'yAxis', 'grid'];
export const seriesItem = {
  type: 'bar',
  barWidth: 15,
  label: {
    show: true,
    position: 'top',
    color: '#ffffff',
    fontSize: 12,
  },
  itemStyle: {
    color: null,
    borderRadius: 2,
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
  public key = BarCommonConfig.key;
  public chartConfig = cloneDeep(BarCommonConfig);
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes);
}
