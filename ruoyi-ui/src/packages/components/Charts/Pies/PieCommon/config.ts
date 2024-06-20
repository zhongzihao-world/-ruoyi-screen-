import cloneDeep from 'lodash/cloneDeep';

import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public';
import { CreateComponentType } from '@/packages/index.d';
import { PieCommonConfig } from './index';
import dataset from './data.json';

export const includes = ['title', 'legend'];

export const series = [
  {
    type: 'pie',
    radius: '50%',
    label: {
      show: true,
      color: '#ffffff',
      fontSize: 12,
    },
  },
];

const option = {
  type: 'ring',
  tooltip: {
    show: true,
    trigger: 'item',
  },
  legend: {
    show: true,
  },
  dataset,
  series,
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public key = PieCommonConfig.key;
  public chartConfig = cloneDeep(PieCommonConfig);
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes);
}
