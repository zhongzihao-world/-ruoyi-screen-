import cloneDeep from 'lodash/cloneDeep';

import { PublicConfigClass } from '@/packages/public';
import type { CreateComponentType } from '@/packages/index.d';
import { ImageConfig } from './index';

export const option = {
  dataset: 'https://doc.ruoyi.vip/images/logo.png',
  fit: 'contain',
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public key = ImageConfig.key;
  public chartConfig = cloneDeep(ImageConfig);
  public option = cloneDeep(option);
}
