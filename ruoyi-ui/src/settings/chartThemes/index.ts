import dark from './themes/dark.json';
import shine from './themes/shine.json';
import macarons from './themes/macarons.json';
import roma from './themes/roma.json';
import infographic from './themes/infographic.json';
import wonderland from './themes/wonderland.json';
import purplePassion from './themes/purplePassion.json';
import walden from './themes/walden.json';

// 默认主题详细配置
import themeJson from './global.theme.json';

// 自定义颜色
export type CustomColorsType = {
  id: string;
  name: string;
  color: string[];
};

// 默认主题
export const defaultTheme = 'dark';
export const chartColors = {
  dark,
  shine,
  macarons,
  roma,
  infographic,
  wonderland,
  purplePassion,
  walden,
};
// 主题色列表, 自定义的颜色使用的是 UUID 作为标识，因为两者数据结构不一致
export type ChartColorsNameType = keyof typeof chartColors;

export type EchartsRenderer = 'svg' | 'canvas';

// 默认主题详细配置
type ThemeJsonType = typeof themeJson;
export interface GlobalThemeJsonType extends Partial<ThemeJsonType> {
  dataset?: any;
  renderer?: EchartsRenderer;
  [T: string]: any;
}
export const globalThemeJson = {
  ...themeJson,
  dataset: null,
  renderer: 'svg' as const,
};
