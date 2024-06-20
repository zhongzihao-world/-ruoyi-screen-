import {
  type ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { CategoryEnum, CategoryEnumName } from '../../index.d';

export const TextNormalConfig: ConfigType = {
  package: PackagesCategoryEnum.COMMON,
  category: CategoryEnum.TEXT,
  categoryName: CategoryEnumName.TEXT,
  chartFrame: ChartFrameEnum.STATIC, // 不需要配置数据源
  key: 'TextNormal',
  chartKey: 'VTextNormal',
  conKey: 'VCTextNormal',
  title: '普通文字',
  image: 'TextNormal.png',
};
