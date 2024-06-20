import type { GlobalThemeJsonType } from '@/settings/chartThemes/index';
import type { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d';

export enum ChartFrameEnum {
  // 支持 dataset 的 echarts 框架
  ECHARTS = 'echarts',
  // UI 组件框架
  ELEMENT_UI = 'elementUI',
  // 自定义带数据组件
  COMMON = 'common',
  // 无数据变更
  STATIC = 'static',
}

// 组件配置
export type ConfigType = {
  package: string; // 一级目录
  category: string; // 二级目录
  categoryName: string; // 二级目录名
  chartFrame?: ChartFrameEnum; // 组件类型
  key: string; // 组件名
  chartKey: string; // 展示组件
  conKey: string; // 配置组件
  title: string;
  image: string;
};

// 数据请求
interface requestConfig {
  request: RequestConfigType;
}

// 组件状态
export interface StatusType {
  lock: boolean;
  hide: boolean;
}

// 组件实例类
export interface PublicConfigType {
  id: string;
  isGroup: boolean;
  attr: {
    x: number;
    y: number;
    w: number;
    h: number;
    zIndex: number;
    offsetX: number;
    offsetY: number;
  };
  styles: {
    opacity: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
  };
  preview?: {
    // 预览超出隐藏
    overFlowHidden?: boolean;
  };
  filter?: string;
  status: StatusType;
  events: {};
}

export interface CreateComponentType extends PublicConfigType, requestConfig {
  key: string;
  chartConfig: ConfigType;
  option: GlobalThemeJsonType;
}

// 组件成组实例类
export interface CreateComponentGroupType extends CreateComponentType {
  groupList: Array<CreateComponentType>;
}

// 获取组件实例类中某个key对应value类型的方法
export type PickCreateComponentType<T extends keyof CreateComponentType> = Pick<
  CreateComponentType,
  T
>[T];

// 包分类枚举
export enum PackagesCategoryEnum {
  CHARTS = 'Charts',
  COMMON = 'Common',
}

// 包分类名称
export enum PackagesCategoryName {
  CHARTS = '图表',
  COMMON = '通用',
}

// 获取组件
export enum FetchComFlagType {
  VIEW,
  CONFIG,
}

// 图表包类型
export type PackagesType = {
  [PackagesCategoryEnum.CHARTS]: ConfigType[];
  [PackagesCategoryEnum.COMMON]: ConfigType[];
};
