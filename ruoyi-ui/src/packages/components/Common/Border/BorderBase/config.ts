import cloneDeep from 'lodash/cloneDeep';

import { PublicConfigClass } from '@/packages/public';
import type { CreateComponentType } from '@/packages/index.d';
import { BorderBaseConfig } from './index';

export const option = {
  borderTitle: '通用边框标题',
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public key = BorderBaseConfig.key;
  public chartConfig = cloneDeep(BorderBaseConfig);
  public option = cloneDeep(option);
}
