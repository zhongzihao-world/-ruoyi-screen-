import {
  ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d';

const key = 'PieCommon';
export const PieCommonConfig: ConfigType = {
  package: PackagesCategoryEnum.CHARTS,
  category: ChatCategoryEnum.PIE,
  categoryName: ChatCategoryEnumName.PIE,
  chartFrame: ChartFrameEnum.ECHARTS,
  key,
  chartKey: 'V' + key,
  conKey: 'VC' + key,
  title: '饼状图',
  image: 'PieCommon.png',
};
