import { ChartList } from '@/packages/components/Charts/index';
import { CommonList } from '@/packages/components/Common/index';
import {
  PackagesCategoryEnum,
  PackagesType,
  ConfigType,
  FetchComFlagType,
} from '@/packages/index.d';

const configModules: any = import.meta.glob('./components/**/config.vue', {
  eager: true,
});
const indexModules: any = import.meta.glob('./components/**/index.vue', {
  eager: true,
});
const imagesModules: any = import.meta.glob('../assets/packages/**', {
  eager: true,
});

// 所有图表
export let packagesList: PackagesType = {
  [PackagesCategoryEnum.CHARTS]: ChartList,
  [PackagesCategoryEnum.COMMON]: CommonList,
};

/**
 * 获取目标组件配置信息
 * @param targetData
 */
export const createComponent = async (targetData: ConfigType) => {
  const { category, key } = targetData;
  const chart = await import(
    `./components/${targetData.package}/${category}/${key}/config.ts`
  );
  return new chart.default();
};

/**
 * 获取组件
 * @param {string} chartName 名称
 * @param {FetchComFlagType} flag 标识 0为展示组件, 1为配置组件
 */
const fetchComponent = (chartName: string, flag: FetchComFlagType) => {
  const module = flag === FetchComFlagType.VIEW ? indexModules : configModules;
  for (const key in module) {
    const urlSplit = key.split('/');
    if (urlSplit[urlSplit.length - 2] === chartName) {
      return module[key];
    }
  }
};

/**
 * 获取展示组件
 * @param {ConfigType} dropData 配置项
 */
export const fetchChartComponent = (dropData: ConfigType) => {
  const { key } = dropData;
  return fetchComponent(key, FetchComFlagType.VIEW).default;
};

/**
 * 获取配置组件
 * @param {ConfigType} dropData 配置项
 */
export const fetchConfigComponent = (dropData: ConfigType) => {
  const { key } = dropData;
  return fetchComponent(key, FetchComFlagType.CONFIG).default;
};

/**
 * 获取图片内容
 * @param {ConfigType} targetData 配置项
 */
export const fetchImages = async (targetData?: ConfigType) => {
  if (!targetData) return '';

  const { image } = targetData;
  const imageName = image.substring(image.lastIndexOf('/') + 1);
  for (const key in imagesModules) {
    const urlSplit = key.split('/');
    if (urlSplit[urlSplit.length - 1] === imageName) {
      return imagesModules[key].default;
    }
  }
  return '';
};
