import {
  type ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { CategoryEnum, CategoryEnumName } from '../../index.d';

export const TextGradientConfig: ConfigType = {
  package: PackagesCategoryEnum.COMMON,
  category: CategoryEnum.TEXT,
  categoryName: CategoryEnumName.TEXT,
  chartFrame: ChartFrameEnum.STATIC, // 不需要配置数据源
  key: 'TextGradient',
  chartKey: 'VTextGradient',
  conKey: 'VCTextGradient',
  title: '渐变文字',
  image: 'TextGradient.png',
};
