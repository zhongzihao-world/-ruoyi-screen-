import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public';
import { MapCommonConfig } from './index';
import { CreateComponentType } from '@/packages/index.d';
import cloneDeep from 'lodash/cloneDeep';
import dataset from './data.json';

export const includes = ['title'];
export const option = {
  title: {
    show: true,
  },
  tooltip: {
    show: true,
    trigger: 'item',
  },
  visualMap: {
    show: true,
    type: 'continuous',
    orient: 'vertical',
    min: 1,
    max: 100,
    inRange: {
      color: ['#c3d7df', '#5cb3cc', '#8abcd1', '#66a9c9', '#2f90b9', '#1781b5']
    },
    textStyle: {
      color: '#ffffff',
    },
  },
  geo: {
    show: false,
    type: 'map',
    map: 'china',
    roam: true, // 是否开启鼠标缩放和平移漫游
    silent: true, // 是否不响应和触发鼠标事件
    zoom: 1,
    aspectScale: 0.75,
  },
  series: [
    {
      type: 'map',
      map: 'china',
      name: '省份',
      data: [],
      geoIndex: 1,
      selectedMode: false, // 是否允许选中多个区域
      label: {
        show: true,
        color: '#ffffff',
        fontSize: 12,
        formatter: (obj: any) => {
          if (!obj.value) {
            return '';
          }
          return `${obj.name}\n${obj.value}`;
        },
      },
      emphasis: {
        disabled: false,
        label: {
          color: '#ffffff',
          fontSize: 12,
        },
        itemStyle: {
          areaColor: '#389BB7',
          shadowColor: '#389BB7',
          borderWidth: 1,
        },
      },
      itemStyle: {
        areaColor: 'transparent',
        borderWidth: 1,
        borderColor: '#93EBF8',
        shadowBlur: 10,
        shadowColor: '#80D9F842',
      },
    },
  ],
  mapRegion: {
    adcode: 'china',
    showHainanIsLands: true,
  },
  dataset,
};
export const MapDefaultConfig = { ...option };
export default class Config
  extends PublicConfigClass
  implements CreateComponentType
{
  public key: string = MapCommonConfig.key;
  public attr = {
    x: 50,
    y: 50,
    w: 600,
    h: 600,
    offsetX: 0,
    offsetY: 0,
    zIndex: -1,
  };
  public chartConfig = cloneDeep(MapCommonConfig);
  public option = echartOptionProfixHandle(option, includes);
}
