import {
  type ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { CategoryEnum, CategoryEnumName } from '../../index.d';

const key = 'BorderBase';
export const BorderBaseConfig: ConfigType = {
  package: PackagesCategoryEnum.COMMON,
  category: CategoryEnum.BORDER,
  categoryName: CategoryEnumName.BORDER,
  chartFrame: ChartFrameEnum.STATIC, // 不需要配置数据源
  key,
  chartKey: 'V' + key,
  conKey: 'VC' + key,
  title: '通用边框',
  image: 'image.png',
};
