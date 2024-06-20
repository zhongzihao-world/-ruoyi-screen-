import cloneDeep from 'lodash/cloneDeep';

import { PublicConfigClass } from '@/packages/public';
import type { CreateComponentType } from '@/packages/index.d';
import { Border01Config } from './index';

export const option = {
  time: 0.6,
  colors: ['#4fd2dd', '#235fa7'],
  backgroundColor: '#00000000',
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public key = Border01Config.key;
  public chartConfig = cloneDeep(Border01Config);
  public option = cloneDeep(option);
}
