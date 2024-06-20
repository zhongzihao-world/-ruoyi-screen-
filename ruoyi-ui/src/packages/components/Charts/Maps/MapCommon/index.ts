import {
  ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d';

const key = 'MapCommon';
export const MapCommonConfig: ConfigType = {
  package: PackagesCategoryEnum.CHARTS,
  category: ChatCategoryEnum.MAP,
  categoryName: ChatCategoryEnumName.MAP,
  chartFrame: ChartFrameEnum.ECHARTS,
  key,
  chartKey: 'V' + key,
  conKey: 'VC' + key,
  title: '标准地图',
  image: 'MapCommon.png',
};
