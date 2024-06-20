import {
  type ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { CategoryEnum, CategoryEnumName } from '../../index.d';

export const ImageCarouselConfig: ConfigType = {
  package: PackagesCategoryEnum.COMMON,
  category: CategoryEnum.MEDIA,
  categoryName: CategoryEnumName.MEDIA,
  chartFrame: ChartFrameEnum.STATIC, // 不需要配置数据源
  key: 'ImageCarousel',
  chartKey: 'VImageCarousel',
  conKey: 'VCImageCarousel',
  title: '轮播图',
  image: 'image.png',
};
