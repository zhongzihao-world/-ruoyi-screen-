import {
  type ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { CategoryEnum, CategoryEnumName } from '../../index.d';

export const TextRollConfig: ConfigType = {
  package: PackagesCategoryEnum.COMMON,
  category: CategoryEnum.TEXT,
  categoryName: CategoryEnumName.TEXT,
  chartFrame: ChartFrameEnum.STATIC, // 不需要配置数据源
  key: 'TextRoll',
  chartKey: 'VTextRoll',
  conKey: 'VCTextRoll',
  title: '滚动文字',
  image: 'TextRoll.png',
};
