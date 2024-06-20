import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';

import { RequestHttpIntervalEnum } from '@/enums/httpEnum';
import {
  excludeParseEventKeyList,
  excludeParseEventValueList,
} from '@/enums/eventEnum';

import {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import { toString } from './type';

/**
 * * 判断是否是预览页
 * @returns boolean
 */
export const isPreview = () => {
  return window.location.pathname.includes('preview');
};

/**
 * * 生成一个不重复的ID
 * @param { Number } randomLength
 */
export const getUUID = (randomLength = 10) => {
  return Number(
    Math.random().toString().substring(2, randomLength) + Date.now(),
  ).toString(36);
};

/**
 * 修改元素位置
 * @param target 对象
 * @param x X轴
 * @param y Y轴
 */
export const setComponentPosition = (
  target: CreateComponentType | CreateComponentGroupType,
  x?: number,
  y?: number,
) => {
  x && (target.attr.x = x);
  y && (target.attr.y = y);
};

/**
 * * 挂载监听
 */
// eslint-disable-next-line no-undef
export const addEventListener = <K extends keyof WindowEventMap>(
  target: HTMLElement | Document,
  type: K,
  listener: any,
  delay?: number,
  // eslint-disable-next-line no-undef
  options?: boolean | AddEventListenerOptions | undefined,
) => {
  if (!target) return;
  target.addEventListener(
    type,
    throttle(listener, delay || 300, {
      leading: true,
      trailing: false,
    }),
    options,
  );
};

/**
 * * 卸载监听
 */
// eslint-disable-next-line no-undef
export const removeEventListener = <K extends keyof WindowEventMap>(
  target: HTMLElement | Document,
  type: K,
  listener: any,
) => {
  if (!target) return;
  target.removeEventListener(type, listener);
};

/**
 * * 函数过滤器
 * @param data 数据值
 * @param res 返回顶级对象
 * @param funcStr 函数字符串
 * @param isToString 是否转为字符串
 * @param errorCallBack 错误回调函数
 * @param successCallBack 成功回调函数
 * @returns
 */
export const newFunctionHandle = (
  data: any,
  res: any,
  funcStr?: string,
  isToString?: boolean,
  errorCallBack?: Function,
  successCallBack?: Function,
) => {
  try {
    if (!funcStr) return data;
    const fn = new Function('data', 'res', funcStr);
    const fnRes = fn(cloneDeep(data), cloneDeep(res));
    const resHandle = isToString ? toString(fnRes) : fnRes;
    // 成功回调
    successCallBack && successCallBack(resHandle);
    return resHandle;
  } catch (error) {
    // 失败回调
    errorCallBack && errorCallBack(error);
    return '函数执行错误';
  }
};

/**
 * * 处理请求事件单位
 * @param num 时间间隔
 * @param unit RequestHttpIntervalEnum
 * @return number 秒数
 */
export const intervalUnitHandle = (
  num: number,
  unit: RequestHttpIntervalEnum,
) => {
  switch (unit) {
    // 秒
    case RequestHttpIntervalEnum.SECOND:
      return num * 1000;
    // 分
    case RequestHttpIntervalEnum.MINUTE:
      return num * 1000 * 60;
    // 时
    case RequestHttpIntervalEnum.HOUR:
      return num * 1000 * 60 * 60;
    // 天
    case RequestHttpIntervalEnum.DAY:
      return num * 1000 * 60 * 60 * 24;
    default:
      return num * 1000;
  }
};

/**
 * * JSON序列化，支持函数和 undefined
 * @param data
 */
export const JSONStringify = <T>(data: T) => {
  return JSON.stringify(
    data,
    (key, val) => {
      // 处理函数丢失问题
      if (typeof val === 'function') {
        return `${val}`;
      }
      // 处理 undefined 丢失问题
      if (typeof val === 'undefined') {
        return null;
      }
      return val;
    },
    2,
  );
};

/**
 * * JSON反序列化，支持函数和 undefined
 * @param data
 */
export const JSONParse = (data: string) => {
  return JSON.parse(data, (k, v) => {
    // 过滤函数字符串
    if (excludeParseEventKeyList.includes(k)) return v;
    // 过滤函数值表达式
    if (typeof v === 'string') {
      const someValue = excludeParseEventValueList.some(
        excludeValue => v.indexOf(excludeValue) > -1,
      );
      if (someValue) return v;
    }
    // 还原函数值
    if (
      typeof v === 'string' &&
      v.indexOf &&
      (v.indexOf('function') > -1 || v.indexOf('=>') > -1)
    ) {
      return eval(`(function(){return ${v}})()`);
    } else if (
      typeof v === 'string' &&
      v.indexOf &&
      v.indexOf('return ') > -1
    ) {
      const baseLeftIndex = v.indexOf('(');
      if (baseLeftIndex > -1) {
        const newFn = `function ${v.substring(baseLeftIndex)}`;
        return eval(`(function(){return ${newFn}})()`);
      }
    }
    return v;
  });
};
