import cloneDeep from 'lodash/cloneDeep';

import { PublicConfigClass } from '@/packages/public';
import type { CreateComponentType } from '@/packages/index.d';
import { TableRollConfig } from './index';
import dataset from './data.json';

export const option = {
  dataset,
  // 表头
  header: ['列1', '列2', '列3'], // 数据列
  headerHeight: 35, // 高度
  headerBgColor: 'rgba(0, 186, 255, 1)',
  headerColor: 'rgba(255, 255, 255, 1)',

  rowNum: 5, // 展示行数
  columnWidth: [], // 列宽
  align: 'center', // 对齐方式
  index: false, // 是否展示序号

  carousel: 'single', // 滚动方式
  waitTime: 2, // 间隔时间

  // 奇数行
  oddRowBgColor: 'rgba(0, 59, 81, 1)',
  oddRowColor: 'rgba(255, 255, 255, 1)',
  // 偶数行
  evenRowBgColor: 'rgba(10, 39, 50, 1)',
  evenRowColor: 'rgba(255, 255, 255, 1)',
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public key = TableRollConfig.key;
  public chartConfig = cloneDeep(TableRollConfig);
  public option = cloneDeep(option);
}
