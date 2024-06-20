import { ref } from 'vue';

import {
  PackagesCategoryEnum,
  PackagesCategoryName,
  PackagesType,
} from '@/packages/index.d';
// 图表
import { usePackagesStore } from '@/store/modules/packagesStore/packagesStore';
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d';
import { setItem, getCharts } from './useLayout.hook';

// 图表
export type MenuOptionsType = {
  key: string;
  icon: string;
  label: string;
  list: PackagesType;
};

const { getPackagesList } = usePackagesStore();
const menuOptions: MenuOptionsType[] = [];

const packagesListObj = {
  [PackagesCategoryEnum.CHARTS]: {
    icon: 'DataAnalysis',
    label: PackagesCategoryName.CHARTS,
  },
  [PackagesCategoryEnum.COMMON]: {
    icon: 'Coin',
    label: PackagesCategoryName.COMMON,
  },
};

// 处理列表
const handlePackagesList = () => {
  for (const val in getPackagesList) {
    menuOptions.push({
      key: val,
      // @ts-ignore
      icon: packagesListObj[val].icon,
      // @ts-ignore
      label: packagesListObj[val].label,
      // @ts-ignore
      list: getPackagesList[val],
    });
  }
};
handlePackagesList();

// 记录选中值
let beforeSelect: string = menuOptions[0]['key'];
const selectValue = ref<string>(menuOptions[0]['key']);

// 选中的对象值
const selectOptions = ref(menuOptions[0]);

// 点击 item
const clickItemHandle = (key: string, item: any) => {
  selectValue.value = key;
  selectOptions.value = item;
  // 处理折叠
  if (beforeSelect === key) {
    setItem(ChartLayoutStoreEnum.CHARTS, !getCharts.value);
  } else {
    setItem(ChartLayoutStoreEnum.CHARTS, true);
  }
  beforeSelect = key;
};

export { getCharts, selectOptions, selectValue, clickItemHandle, menuOptions };
