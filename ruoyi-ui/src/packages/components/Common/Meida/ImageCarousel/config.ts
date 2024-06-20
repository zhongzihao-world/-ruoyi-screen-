import cloneDeep from 'lodash/cloneDeep';

import { PublicConfigClass } from '@/packages/public';
import type { CreateComponentType } from '@/packages/index.d';
import { ImageCarouselConfig } from './index';

export const option = {
  dataset: [
    'https://doc.ruoyi.vip/images/logo.png',
    'https://doc.ruoyi.vip/images/logo.png',
  ],
  fit: 'contain',

  direction: 'horizontal', // "horizontal" | "vertical" | undefined
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public key = ImageCarouselConfig.key;
  public chartConfig = cloneDeep(ImageCarouselConfig);
  public option = cloneDeep(option);
}
