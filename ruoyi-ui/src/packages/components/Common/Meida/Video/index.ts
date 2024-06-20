import {
  type ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { CategoryEnum, CategoryEnumName } from '../../index.d';

export const VideoConfig: ConfigType = {
  package: PackagesCategoryEnum.COMMON,
  category: CategoryEnum.MEDIA,
  categoryName: CategoryEnumName.MEDIA,
  chartFrame: ChartFrameEnum.STATIC, // 不需要配置数据源
  key: 'Video',
  chartKey: 'VVideo',
  conKey: 'VCVideo',
  title: '视频',
  image: 'image.png',
};
