import {
  type ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { CategoryEnum, CategoryEnumName } from '../../index.d';

export const ImageConfig: ConfigType = {
  package: PackagesCategoryEnum.COMMON,
  category: CategoryEnum.MEDIA,
  categoryName: CategoryEnumName.MEDIA,
  chartFrame: ChartFrameEnum.STATIC, // 不需要配置数据源
  key: 'Image',
  chartKey: 'VImage',
  conKey: 'VCImage',
  title: '图片',
  image: 'image.png',
};
