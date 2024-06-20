import cloneDeep from 'lodash/cloneDeep';

import { PublicConfigClass } from '@/packages/public';
import type { CreateComponentType } from '@/packages/index.d';
import { TextGradientConfig } from './index';

export const option = {
  dataset: import.meta.env.VITE_APP_TITLE,
  fontSize: 60,
  letterSpacing: 5, // 间距
  textAlignX: 'center', // 水平对齐
  textAlignY: 'center', // 垂直对齐
  color: {
    deg: 90,
    from: '#0000FFFF',
    to: '#00FF00FF',
  },
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public attr = {
    x: 50,
    y: 50,
    w: 500,
    h: 200,
    offsetX: 0,
    offsetY: 0,
    zIndex: -1,
  };
  public key = TextGradientConfig.key;
  public chartConfig = cloneDeep(TextGradientConfig);
  public option = cloneDeep(option);
}
