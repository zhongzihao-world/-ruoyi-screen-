import cloneDeep from 'lodash/cloneDeep';

import { getUUID } from '@/utils';
import type { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d';
import {
  RequestHttpEnum,
  RequestDataTypeEnum,
  RequestHttpIntervalEnum,
  RequestContentTypeEnum,
  RequestBodyEnum,
} from '@/enums/httpEnum';
import {
  ChartFrameEnum,
  type PublicConfigType,
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';

// 请求基础属性
export const requestConfig: RequestConfigType = {
  requestDataType: RequestDataTypeEnum.STATIC,
  requestHttpType: RequestHttpEnum.GET,
  requestUrl: '',
  requestInterval: undefined,
  requestIntervalUnit: RequestHttpIntervalEnum.SECOND,
  requestContentType: RequestContentTypeEnum.DEFAULT,
  requestParamsBodyType: RequestBodyEnum.NONE,
  requestSQLContent: {
    sql: 'select * from  where',
  },
  requestParams: {
    Body: {
      'form-data': {},
      'x-www-form-urlencoded': {},
      json: '',
    },
    Header: {},
    Params: {},
  },
};

// 单实例类
export class PublicConfigClass implements PublicConfigType {
  public id = getUUID();
  public isGroup = false;
  // 图表初始配置
  public attr = {
    x: 50,
    y: 50,
    w: 500,
    h: 300,
    // 不建议动 offset
    offsetX: 0,
    offsetY: 0,
    zIndex: -1,
  };
  // 基本样式
  public styles = {
    opacity: 100,
    // 内填充
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  };
  // 预览
  public preview = {
    overFlowHidden: false,
  };
  // 状态
  public status = {
    lock: false,
    hide: false,
  };
  // 请求
  public request = cloneDeep(requestConfig);
  // 数据过滤
  public filter = undefined;
  // 事件
  public events = {};
}

// 多选成组类
export class PublicGroupConfigClass
  extends PublicConfigClass
  implements CreateComponentGroupType
{
  // 成组
  public isGroup = true;
  // 名称
  public chartConfig = {
    key: 'group',
    chartKey: 'group',
    conKey: 'group',
    category: 'group',
    categoryName: 'group',
    package: 'group',
    chartFrame: ChartFrameEnum.COMMON,
    title: '分组',
    image: '',
  };
  // 组成员列表
  public groupList: Array<CreateComponentType> = [];
  // ---- 原有 ---
  // key
  public key = 'group';
  // 配置
  public option = {};
  // 标识
  public id = getUUID();
  // 基本信息
  public attr = { w: 0, h: 0, x: 0, y: 0, offsetX: 0, offsetY: 0, zIndex: -1 };
}
