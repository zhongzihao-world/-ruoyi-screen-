import {
  type ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { CategoryEnum, CategoryEnumName } from '../../index.d';

const key = 'Border01';
export const Border01Config: ConfigType = {
  package: PackagesCategoryEnum.COMMON,
  category: CategoryEnum.BORDER,
  categoryName: CategoryEnumName.BORDER,
  chartFrame: ChartFrameEnum.STATIC, // 不需要配置数据源
  key,
  chartKey: 'V' + key,
  conKey: 'VC' + key,
  title: '边框-01',
  image: 'image.png',
};
