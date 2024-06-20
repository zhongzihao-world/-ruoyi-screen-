import {
  type ConfigType,
  PackagesCategoryEnum,
  ChartFrameEnum,
} from '@/packages/index.d';
import { CategoryEnum, CategoryEnumName } from '../../index.d';

const key = 'TableRoll';

export const TableRollConfig: ConfigType = {
  package: PackagesCategoryEnum.COMMON,
  category: CategoryEnum.TABLE,
  categoryName: CategoryEnumName.TABLE,
  chartFrame: ChartFrameEnum.COMMON,
  key,
  chartKey: 'V' + key,
  conKey: 'VC' + key,
  title: '滚动表格',
  image: 'TableRoll.png',
};
