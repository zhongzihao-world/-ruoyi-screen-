import { chartColors, CustomColorsType } from '@/settings/chartThemes/index';

/**
 * * 合并基础颜色和自定义颜色
 * @param chartDefaultColors
 * @param customColor
 * @returns
 */
export const colorCustomMerge = (customColor?: CustomColorsType[]) => {
  type FormateCustomColorType = {
    [T: string]: {
      color: string[];
      name: string;
    };
  };
  const formateCustomColor: FormateCustomColorType = {};
  customColor?.forEach(item => {
    formateCustomColor[item.id] = {
      color: item.color,
      name: item.name,
    };
  });
  return { ...formateCustomColor, ...chartColors };
};
