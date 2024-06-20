import cloneDeep from 'lodash/cloneDeep';

import { PublicConfigClass } from '@/packages/public';
import type { CreateComponentType } from '@/packages/index.d';
import { VideoConfig } from './index';

export const option = {
  dataset: '',
  loop: true,
  muted: true,
  fit: 'contain',
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public key = VideoConfig.key;
  public chartConfig = cloneDeep(VideoConfig);
  public option = cloneDeep(option);
}
