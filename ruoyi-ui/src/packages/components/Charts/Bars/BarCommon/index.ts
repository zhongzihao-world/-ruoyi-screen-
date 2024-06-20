import {
  ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d';

const key = 'BarCommon';
export const BarCommonConfig: ConfigType = {
  package: PackagesCategoryEnum.CHARTS,
  category: ChatCategoryEnum.BAR,
  categoryName: ChatCategoryEnumName.BAR,
  chartFrame: ChartFrameEnum.ECHARTS,
  key,
  chartKey: 'V' + key,
  conKey: 'VC' + key,
  title: '柱状图',
  image: 'BarCommon.png',
};
