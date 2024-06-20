import cloneDeep from 'lodash/cloneDeep';

import { PublicConfigClass } from '@/packages/public';
import type { CreateComponentType } from '@/packages/index.d';
import { TextNormalConfig } from './index';

export const option = {
  dataset: import.meta.env.VITE_APP_TITLE,
  fontSize: 60,
  letterSpacing: 5, // 间距
  textAlignX: 'center', // 水平对齐
  textAlignY: 'center', // 垂直对齐
  color: 'rgba(255, 69, 0, 1)',
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
  public key = TextNormalConfig.key;
  public chartConfig = cloneDeep(TextNormalConfig);
  public option = cloneDeep(option);
}
