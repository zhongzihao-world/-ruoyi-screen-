import {
  ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d';

const key = 'BarCross';
export const BarCrossConfig: ConfigType = {
  package: PackagesCategoryEnum.CHARTS,
  category: ChatCategoryEnum.BAR,
  categoryName: ChatCategoryEnumName.BAR,
  chartFrame: ChartFrameEnum.ECHARTS,
  key,
  chartKey: 'V' + key,
  conKey: 'VC' + key,
  title: '横向柱状图',
  image: 'BarCross.png',
};
