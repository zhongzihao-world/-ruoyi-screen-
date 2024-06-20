import {
  ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d';

const key = 'ScatterCommon';
export const ScatterCommonConfig: ConfigType = {
  package: PackagesCategoryEnum.CHARTS,
  category: ChatCategoryEnum.SCATTER,
  categoryName: ChatCategoryEnumName.SCATTER,
  chartFrame: ChartFrameEnum.ECHARTS,
  key,
  chartKey: 'V' + key,
  conKey: 'VC' + key,
  title: '散点图',
  image: 'ScatterCommon.png',
};
