import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';

import type {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import { PublicGroupConfigClass } from '@/packages/public/publicConfig';
import { defaultTheme, globalThemeJson } from '@/settings/chartThemes/index';
// 记录记录
import { useChartHistoryStore } from '@/store/modules/chartHistoryStore/chartHistoryStore';
// 全局设置
import { useChartSettingStore } from '@/store/modules/chartSettingStore/chartSettingStore';
import {
  type HistoryItemType,
  HistoryActionTypeEnum,
  HistoryTargetTypeEnum,
} from '@/store/modules/chartHistoryStore/chartHistoryStore.d';
import { MenuEnum } from '@/enums/editPageEnum';
import { PreviewScaleEnum } from '@/enums/styleEnum';
import { RequestHttpIntervalEnum } from '@/enums/httpEnum';
import {
  getUUID,
  loadingStart,
  loadingFinish,
  loadingError,
  isString,
  isArray,
} from '@/utils';
import type {
  ChartEditStorage,
  ChartEditStoreType,
  EditCanvasType,
  MousePositionType,
  TargetChartType,
  RecordChartType,
  RequestGlobalConfigType,
  EditCanvasConfigType,
} from './chartEditStore.d';
import { ChartEditStoreEnum } from './chartEditStore.d';

const chartHistoryStore = useChartHistoryStore();
const chartSettingStore = useChartSettingStore();

export const useChartEditStore = defineStore({
  id: 'useChartEditStore',
  state: (): ChartEditStoreType => ({
    // 右键菜单
    rightMenuShow: false,
    // 鼠标定位
    mousePosition: {
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
    },
    // 目标图表
    targetChart: {
      hoverId: undefined,
      selectId: [],
    },
    // 记录临时数据（复制等）
    recordChart: undefined,

    // 画布属性
    editCanvas: {
      // 编辑区域 DOM
      editLayoutDom: null,
      editContentDom: null,
      // 偏移大小
      offset: 20,
      // 缩放
      scale: 1,
      // 锁定缩放
      lockScale: false,
      // 初始化
      isCreate: false,
      // 拖拽中
      isDrag: false,
      // 框选中
      isSelect: false,
    },
    // 需要存储到数据库的属性
    // 页面属性
    editCanvasConfig: {
      // 项目名称
      projectName: undefined,
      // 默认宽度
      width: 1920,
      // 默认高度
      height: 1080,
      // 默认背景色
      background: 'rgba(0, 0, 0, .8)',
      backgroundImage: undefined,
      // 是否使用纯颜色
      selectColor: true,
      // chart 主题色
      chartThemeColor: defaultTheme,
      // 自定义颜色列表
      chartCustomThemeColorInfo: undefined,
      // 全局配置
      chartThemeSetting: globalThemeJson,
      // 适配方式
      previewScaleType: PreviewScaleEnum.FIT,
    },
    // 请求属性
    requestGlobalConfig: {
      requestDataPond: [],
      requestOriginUrl: '',
      requestInterval: 30,
      requestIntervalUnit: RequestHttpIntervalEnum.SECOND,
      requestParams: {
        Body: {
          'form-data': {},
          'x-www-form-urlencoded': {},
          json: '',
        },
        Header: {},
        Params: {},
      },
    },
    // 组件属性
    componentList: [],
  }),
  getters: {
    getRightMenuShow(): boolean {
      return this.rightMenuShow;
    },
    getMousePosition(): MousePositionType {
      return this.mousePosition;
    },
    getTargetChart(): TargetChartType {
      return this.targetChart;
    },
    getRecordChart(): RecordChartType | undefined {
      return this.recordChart;
    },

    getEditCanvas(): EditCanvasType {
      return this.editCanvas;
    },
    getEditCanvasConfig(): EditCanvasConfigType {
      return this.editCanvasConfig;
    },
    getRequestGlobalConfig(): RequestGlobalConfigType {
      return this.requestGlobalConfig;
    },
    getComponentList(): Array<CreateComponentType | CreateComponentGroupType> {
      return this.componentList;
    },
    getStorageInfo(): ChartEditStorage {
      return {
        [ChartEditStoreEnum.EDIT_CANVAS_CONFIG]: this.getEditCanvasConfig,
        [ChartEditStoreEnum.COMPONENT_LIST]: this.getComponentList,
        [ChartEditStoreEnum.REQUEST_GLOBAL_CONFIG]: this.getRequestGlobalConfig,
      };
    },
  },
  actions: {
    setRightMenuShow(value: boolean) {
      this.rightMenuShow = value;
    },
    setMousePosition(
      x?: number,
      y?: number,
      startX?: number,
      startY?: number,
    ): void {
      if (x) this.mousePosition.x = x;
      if (y) this.mousePosition.y = y;
      if (startX) this.mousePosition.startX = startX;
      if (startY) this.mousePosition.startY = startY;
    },
    // 设置目标数据 hover
    setTargetHoverChart(hoverId?: TargetChartType['hoverId']) {
      this.targetChart.hoverId = hoverId;
    },
    // 设置目标数据 select
    setTargetSelectChart(selectId?: string | string[], push: boolean = false) {
      // 重复选中
      if (this.targetChart.selectId.find((e: string) => e === selectId)) return;

      // 无 id 清空
      if (!selectId) {
        this.targetChart.selectId = [];
        return;
      }
      // 多选
      if (push) {
        // 字符串
        if (isString(selectId)) {
          this.targetChart.selectId.push(selectId);
          return;
        }
        // 数组
        if (isArray(selectId)) {
          this.targetChart.selectId.push(...selectId);
          return;
        }
      } else {
        // 字符串
        if (isString(selectId)) {
          this.targetChart.selectId = [selectId];
          return;
        }
        // 数组
        if (isArray(selectId)) {
          this.targetChart.selectId = selectId;
          return;
        }
      }
    },
    setRecordChart(item: RecordChartType | undefined) {
      this.recordChart = cloneDeep(item);
    },
    setEditCanvas<T extends keyof EditCanvasType, K extends EditCanvasType[T]>(
      key: T,
      value: K,
    ) {
      this.editCanvas[key] = value;
    },
    setEditCanvasConfig<
      T extends keyof EditCanvasConfigType,
      K extends EditCanvasConfigType[T],
    >(key: T, value: K) {
      this.editCanvasConfig[key] = value;
    },

    // 设置编辑区域属性
    setPageStyle<T extends keyof CSSStyleDeclaration>(
      key: T,
      value: any,
    ): void {
      const dom = this.getEditCanvas.editContentDom;
      if (dom) {
        dom.style[key] = value;
      }
    },
    /**
     * 设置缩放
     * @param scale 0~1 number 缩放比例;
     * @param force boolean 强制缩放
     */
    setScale(scale: number, force = false): void {
      if (!this.getEditCanvas.lockScale || force) {
        this.setPageSize(scale);
        this.getEditCanvas.scale = scale;
      }
    },
    /**
     * 监听缩放
     * @returns
     */
    listenerScale(): Function {
      const resize = debounce(this.computedScale, 200);
      // 默认执行一次
      resize();
      // 开始监听
      window.addEventListener('resize', resize);
      // 销毁函数
      const remove = () => {
        window.removeEventListener('resize', resize);
      };
      return remove;
    },
    /**
     * 设置页面大小
     * @param scale
     */
    setPageSize(scale: number): void {
      this.setPageStyle('height', `${this.editCanvasConfig.height * scale}px`);
      this.setPageStyle('width', `${this.editCanvasConfig.width * scale}px`);
    },
    /**
     * 计算缩放
     */
    computedScale() {
      if (this.getEditCanvas.editLayoutDom) {
        // 现有展示区域
        const width =
          this.getEditCanvas.editLayoutDom.clientWidth -
          this.getEditCanvas.offset * 2 -
          5;
        const height =
          this.getEditCanvas.editLayoutDom.clientHeight -
          this.getEditCanvas.offset * 4;

        // 用户设定大小
        const editCanvasWidth = this.editCanvasConfig.width;
        const editCanvasHeight = this.editCanvasConfig.height;

        // 需保持的比例
        const baseProportion = parseFloat(
          (editCanvasWidth / editCanvasHeight).toFixed(5),
        );
        const currentRate = parseFloat((width / height).toFixed(5));

        if (currentRate > baseProportion) {
          // 表示更宽
          const scaleWidth = parseFloat(
            ((height * baseProportion) / editCanvasWidth).toFixed(5),
          );
          this.setScale(scaleWidth > 1 ? 1 : scaleWidth);
        } else {
          // 表示更高
          const scaleHeight = parseFloat(
            (width / baseProportion / editCanvasHeight).toFixed(5),
          );
          this.setScale(scaleHeight > 1 ? 1 : scaleHeight);
        }
      } else {
        ElMessage.error('画布显示异常');
      }
    },

    // 找到目标 id 数据的下标位置，id可为父级或子集数组（无则返回-1）
    fetchTargetIndex(id?: string): number {
      const targetId =
        id ||
        (this.getTargetChart.selectId.length &&
          this.getTargetChart.selectId[0]) ||
        undefined;
      if (!targetId) {
        return -1;
      }
      const targetIndex = this.componentList.findIndex(e => e.id === targetId);

      // 当前
      if (targetIndex !== -1) {
        return targetIndex;
      } else {
        const length = this.getComponentList.length;
        for (let i = 0; i < length; i++) {
          if (this.getComponentList[i].isGroup) {
            for (const cItem of (
              this.getComponentList[i] as CreateComponentGroupType
            ).groupList) {
              if (cItem.id === targetId) {
                return i;
              }
            }
          }
        }
      }
      return -1;
    },
    // 统一格式化处理入参 id
    idPreFormat(id?: string | string[]) {
      const idArr = [];
      if (!id) {
        idArr.push(...this.getTargetChart.selectId);
        return idArr;
      }
      if (isString(id)) idArr.push(id);
      if (isArray(id)) idArr.push(...id);
      return idArr;
    },
    /**
     * 新增组件
     * @param componentInstance 新图表实例
     * @param isHead 是否头部插入
     * @param isHistory 是否进行记录
     * @returns
     */
    addComponentList(
      componentInstance:
        | CreateComponentType
        | CreateComponentGroupType
        | Array<CreateComponentType | CreateComponentGroupType>,
      isHead = false,
      isHistory = false,
    ) {
      if (componentInstance instanceof Array) {
        componentInstance.forEach(item => {
          this.addComponentList(item, isHead, isHistory);
        });
        return;
      }
      if (isHistory) {
        chartHistoryStore.createAddHistory([componentInstance]);
      }
      if (isHead) {
        this.componentList.unshift(componentInstance);
        return;
      }
      this.componentList.push(componentInstance);
    },
    /**
     * 删除组件
     * @param id 组件 id
     * @param isHistory 是否进行记录
     * @returns
     */
    removeComponentList(id?: string | string[], isHistory = true) {
      try {
        loadingStart();
        const idArr = this.idPreFormat(id);
        const history: Array<CreateComponentType | CreateComponentGroupType> =
          [];
        // 遍历所有对象
        if (!idArr.length) return;

        idArr.forEach(ids => {
          const index = this.fetchTargetIndex(ids);
          if (index !== -1) {
            history.push(this.getComponentList[index]);
            this.componentList.splice(index, 1);
          }
        });
        isHistory && chartHistoryStore.createDeleteHistory(history);
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    // 清空组件
    clearComponentList() {
      try {
        loadingStart();
        this.componentList = [];
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 重置组件位置
     * @param item
     * @param isForward
     */
    resetComponentPosition(
      item: CreateComponentType | CreateComponentGroupType,
      isForward: boolean,
    ) {
      const index = this.fetchTargetIndex(item.id);
      if (index > -1) {
        const componentInstance = this.getComponentList[index];
        if (isForward) {
          componentInstance.attr = Object.assign(componentInstance.attr, {
            x: item.attr.x + item.attr.offsetX,
            y: item.attr.y + item.attr.offsetY,
          });
        } else {
          componentInstance.attr = Object.assign(componentInstance.attr, {
            x: item.attr.x,
            y: item.attr.y,
          });
        }
      }
    },
    /**
     * 移动组件
     * @param item
     */
    moveComponentList(
      item: Array<CreateComponentType | CreateComponentGroupType>,
    ) {
      chartHistoryStore.createMoveHistory(item);
    },
    /**
     * 更新组件列表
     * @param index
     * @param newData
     * @returns
     */
    updateComponentList(
      index: number,
      newData: CreateComponentType | CreateComponentGroupType,
    ) {
      if (index < 1 && index > this.getComponentList.length) return;
      this.componentList[index] = newData;
    },
    /**
     * 移动组件位置(置顶、置底)
     * @param isEnd
     * @param isHistory
     * @returns
     */
    setBothEnds(isEnd = false, isHistory = true): void {
      try {
        loadingStart();

        // 暂不支持多选
        if (this.getTargetChart.selectId.length > 1) return;

        const length = this.getComponentList.length;
        if (length < 2) {
          return;
        }

        const index = this.fetchTargetIndex();
        const targetData = this.getComponentList[index];
        if (index !== -1) {
          // 置底排除最底层, 置顶排除最顶层
          if ((isEnd && index === 0) || (!isEnd && index === length - 1)) {
            return;
          }

          // 记录原有位置
          const setIndex = (
            componentInstance: CreateComponentType | CreateComponentGroupType,
            i: number,
          ) => {
            const temp = cloneDeep(componentInstance);
            temp.attr.zIndex = i;
            return temp;
          };

          // 历史记录
          if (isHistory) {
            chartHistoryStore.createLayerHistory(
              [setIndex(targetData, index)],
              isEnd ? HistoryActionTypeEnum.BOTTOM : HistoryActionTypeEnum.TOP,
            );
          }

          // 插入两端
          this.addComponentList(targetData, isEnd);
          this.getComponentList.splice(isEnd ? index + 1 : index, 1);
        }
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 置顶
     * @param isHistory
     */
    setTop(isHistory = true): void {
      this.setBothEnds(false, isHistory);
    },
    /**
     * 置底
     * @param isHistory
     */
    setBottom(isHistory = true): void {
      this.setBothEnds(true, isHistory);
    },
    /**
     * 互换组件位置(上移、下移)
     * @param isDown
     * @param isHistory
     * @returns
     */
    wrap(isDown = false, isHistory = true) {
      try {
        loadingStart();
        // 暂不支持多选
        if (this.getTargetChart.selectId.length > 1) return;

        const length = this.getComponentList.length;
        if (length < 2) {
          return;
        }

        const index: number = this.fetchTargetIndex();
        if (index !== -1) {
          // 下移排除最底层, 上移排除最顶层
          if ((isDown && index === 0) || (!isDown && index === length - 1)) {
            return;
          }
          // 互换位置
          const swapIndex = isDown ? index - 1 : index + 1;
          const targetItem = this.getComponentList[index];
          const swapItem = this.getComponentList[swapIndex];

          // 历史记录
          if (isHistory) {
            chartHistoryStore.createLayerHistory(
              [targetItem],
              isDown ? HistoryActionTypeEnum.DOWN : HistoryActionTypeEnum.UP,
            );
          }
          this.updateComponentList(index, swapItem);
          this.updateComponentList(swapIndex, targetItem);
        }
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 上移
     * @param isHistory
     */
    setUp(isHistory = true) {
      this.wrap(false, isHistory);
    },
    /**
     * 下移
     * @param isHistory
     */
    setDown(isHistory = true) {
      this.wrap(true, isHistory);
    },
    /**
     * 复制
     * @param isCut
     * @returns
     */
    setCopy(isCut = false) {
      try {
        loadingStart();
        // 暂不支持多选
        if (this.getTargetChart.selectId.length > 1) return;

        const index: number = this.fetchTargetIndex();
        if (index !== -1) {
          const copyData: RecordChartType = {
            charts: this.getComponentList[index],
            type: isCut
              ? HistoryActionTypeEnum.CUT
              : HistoryActionTypeEnum.COPY,
          };
          this.setRecordChart(copyData);
          ElMessage.success(isCut ? '剪切成功' : '复制成功！');
        }
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 剪切
     */
    setCut() {
      this.setCopy(true);
    },
    /**
     * 粘贴
     * @returns
     */
    setParse() {
      try {
        loadingStart();
        const recordCharts = this.getRecordChart;
        if (recordCharts === undefined) {
          return;
        }
        const parseHandle = (
          e: CreateComponentType | CreateComponentGroupType,
        ) => {
          e = cloneDeep(e);
          e.attr.x = this.getMousePosition.x + 30;
          e.attr.y = this.getMousePosition.y + 30;
          // 外层生成新 id
          e.id = getUUID();
          // 分组列表生成新 id
          if (e.isGroup) {
            (e as CreateComponentGroupType).groupList.forEach(
              (item: CreateComponentType) => {
                item.id = getUUID();
              },
            );
          }

          return e;
        };
        const isCut = recordCharts.type === HistoryActionTypeEnum.CUT;
        const targetList = Array.isArray(recordCharts.charts)
          ? recordCharts.charts
          : [recordCharts.charts];
        // 多项
        targetList.forEach(
          (e: CreateComponentType | CreateComponentGroupType) => {
            this.addComponentList(parseHandle(e), undefined, true);
            // 剪切需删除原数据
            if (isCut) {
              this.setTargetSelectChart(e.id);
              this.removeComponentList(undefined, true);
            }
          },
        );
        if (isCut) this.setRecordChart(undefined);
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 撤回、前进
     * @param HistoryItem
     * @param isForward
     * @returns
     */
    setBackAndSetForwardHandle(
      HistoryItem: HistoryItemType,
      isForward = false,
    ) {
      // 处理画布
      if (HistoryItem.targetType === HistoryTargetTypeEnum.CANVAS) {
        this.editCanvas = HistoryItem.historyData[0] as EditCanvasType;
        return;
      }

      // 取消选中
      this.setTargetSelectChart();

      // 重新选中
      let historyData = HistoryItem.historyData as Array<
        CreateComponentType | CreateComponentGroupType
      >;
      if (isArray(historyData)) {
        // 选中目标元素，支持多个
        historyData.forEach(
          (item: CreateComponentType | CreateComponentGroupType) => {
            this.setTargetSelectChart(item.id, true);
          },
        );
      }

      // 处理新增类型
      const isAdd = HistoryItem.actionType === HistoryActionTypeEnum.ADD;
      const isDel = HistoryItem.actionType === HistoryActionTypeEnum.DELETE;
      if (isAdd || isDel) {
        if ((isAdd && isForward) || (isDel && !isForward)) {
          historyData.forEach(item => {
            this.addComponentList(item);
          });
          return;
        }
        historyData.forEach(item => {
          this.removeComponentList(item.id, false);
        });
        return;
      }

      // 处理移动
      const isMove = HistoryItem.actionType === HistoryActionTypeEnum.MOVE;
      if (isMove) {
        historyData.forEach(item => {
          this.resetComponentPosition(item, isForward);
        });
        return;
      }

      // 处理层级
      const isTop = HistoryItem.actionType === HistoryActionTypeEnum.TOP;
      const isBottom = HistoryItem.actionType === HistoryActionTypeEnum.BOTTOM;
      if (isTop || isBottom) {
        if (!isForward) {
          // 插入到原有位置
          if (isTop) this.getComponentList.pop();
          if (isBottom) this.getComponentList.shift();
          this.getComponentList.splice(
            historyData[0].attr.zIndex,
            0,
            historyData[0],
          );
          return;
        }
        if (isTop) this.setTop(false);
        if (isBottom) this.setBottom(false);
      }

      const isUp = HistoryItem.actionType === HistoryActionTypeEnum.UP;
      const isDown = HistoryItem.actionType === HistoryActionTypeEnum.DOWN;
      if (isUp || isDown) {
        if ((isUp && isForward) || (isDown && !isForward)) {
          this.setUp(false);
          return;
        }
        this.setDown(false);
        return;
      }

      // 处理分组
      const isGroup = HistoryItem.actionType === HistoryActionTypeEnum.GROUP;
      const isUnGroup =
        HistoryItem.actionType === HistoryActionTypeEnum.UN_GROUP;
      if (isGroup || isUnGroup) {
        if ((isGroup && isForward) || (isUnGroup && !isForward)) {
          const ids: string[] = [];
          if (historyData.length > 1) {
            historyData.forEach(item => {
              ids.push(item.id);
            });
          } else {
            const group = historyData[0] as CreateComponentGroupType;
            group.groupList.forEach(item => {
              ids.push(item.id);
            });
          }
          this.setGroup(ids, false);
          return;
        }
        // 都需使用子组件的id去解组
        if (historyData.length > 1) {
          this.setUnGroup(
            [(historyData[0] as CreateComponentType).id],
            undefined,
            false,
          );
        } else {
          this.setUnGroup(
            [(historyData[0] as CreateComponentGroupType).groupList[0].id],
            undefined,
            false,
          );
        }
        return;
      }

      // 处理锁定
      const isLock = HistoryItem.actionType === HistoryActionTypeEnum.LOCK;
      const isUnLock = HistoryItem.actionType === HistoryActionTypeEnum.UNLOCK;
      if (isLock || isUnLock) {
        if ((isLock && isForward) || (isUnLock && !isForward)) {
          historyData.forEach(item => {
            this.setLock(!item.status.lock, false);
          });
          return;
        }
        historyData.forEach(item => {
          this.setUnLock(false);
        });
        return;
      }

      // 处理隐藏
      const isHide = HistoryItem.actionType === HistoryActionTypeEnum.HIDE;
      const isShow = HistoryItem.actionType === HistoryActionTypeEnum.SHOW;
      if (isHide || isShow) {
        if ((isHide && isForward) || (isShow && !isForward)) {
          historyData.forEach(item => {
            this.setHide(!item.status.hide, false);
          });
          return;
        }
        historyData.forEach(item => {
          this.setShow(false);
        });
        return;
      }
    },
    /**
     * 撤回
     * @returns
     */
    // *
    setBack() {
      try {
        loadingStart();
        const targetData = chartHistoryStore.backAction();
        if (!targetData) {
          return;
        }
        this.setBackAndSetForwardHandle(targetData);
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 前进
     * @returns
     */
    setForward() {
      try {
        loadingStart();
        const targetData = chartHistoryStore.forwardAction();
        if (!targetData) {
          return;
        }
        this.setBackAndSetForwardHandle(targetData, true);
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 键盘方向移动位置 ↑ ↓ ← →
     * @param keyboardValue
     * @returns
     */
    setMove(keyboardValue: MenuEnum) {
      const index = this.fetchTargetIndex();
      if (index === -1) return;
      const attr = this.getComponentList[index].attr;
      const distance = chartSettingStore.getChartMoveDistance;
      switch (keyboardValue) {
        case MenuEnum.ARROW_UP:
          attr.y -= distance;
          break;
        case MenuEnum.ARROW_RIGHT:
          attr.x += distance;
          break;
        case MenuEnum.ARROW_DOWN:
          attr.y += distance;
          break;
        case MenuEnum.ARROW_LEFT:
          attr.x -= distance;
          break;
      }
    },
    /**
     * 创建分组
     * @param id
     * @param isHistory
     * @returns
     */
    setGroup(id?: string | string[], isHistory = true) {
      try {
        loadingStart();
        const selectIds = this.idPreFormat(id) || this.getTargetChart.selectId;
        if (selectIds.length < 2) return;

        const groupClass = new PublicGroupConfigClass();
        // 记录整体坐标
        const groupAttr = {
          l: this.getEditCanvasConfig.width,
          t: this.getEditCanvasConfig.height,
          r: 0,
          b: 0,
        };
        const targetList: CreateComponentType[] = [];
        const historyList: CreateComponentType[] = [];

        // 若目标中有数组则先解组
        const newSelectIds: string[] = [];
        selectIds.forEach((id: string) => {
          const targetIndex = this.fetchTargetIndex(id);
          if (
            targetIndex !== -1 &&
            this.getComponentList[targetIndex].isGroup
          ) {
            this.setUnGroup(
              [id],
              (e: CreateComponentType[]) => {
                e.forEach(e => {
                  this.addComponentList(e);
                  newSelectIds.push(e.id);
                });
              },
              false,
            );
          } else if (targetIndex !== -1) {
            newSelectIds.push(id);
          }
        });
        newSelectIds.forEach((id: string) => {
          // 获取目标数据并从 list 中移除 (成组后不可再次成组, 断言处理)
          const item = this.componentList.splice(
            this.fetchTargetIndex(id),
            1,
          )[0] as CreateComponentType;
          const { x, y, w, h } = item.attr;
          const { l, t, r, b } = groupAttr;
          // 左
          groupAttr.l = l > x ? x : l;
          // 上
          groupAttr.t = t > y ? y : t;
          // 宽
          groupAttr.r = r < x + w ? x + w : r;
          // 高
          groupAttr.b = b < y + h ? y + h : b;

          targetList.push(item);
          historyList.push(toRaw(item));
        });

        // 修改原数据之前，先记录
        if (isHistory) chartHistoryStore.createGroupHistory(historyList);

        // 设置子组件的位置
        targetList.forEach((item: CreateComponentType) => {
          item.attr.x = item.attr.x - groupAttr.l;
          item.attr.y = item.attr.y - groupAttr.t;
          groupClass.groupList.push(item);
        });

        // 设置 group 属性
        groupClass.attr.x = groupAttr.l;
        groupClass.attr.y = groupAttr.t;
        groupClass.attr.w = groupAttr.r - groupAttr.l;
        groupClass.attr.h = groupAttr.b - groupAttr.t;

        this.addComponentList(groupClass);
        this.setTargetSelectChart(groupClass.id);
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 解除分组
     * @param ids
     * @param callBack
     * @param isHistory
     * @returns
     */
    setUnGroup(
      ids?: string[],
      callBack?: (e: CreateComponentType[]) => void,
      isHistory = true,
    ) {
      try {
        loadingStart();
        const selectGroupIdArr = ids || this.getTargetChart.selectId;
        if (selectGroupIdArr.length !== 1) return;

        // 解组
        const unGroup = (targetIndex: number) => {
          const targetGroup = this.getComponentList[
            targetIndex
          ] as CreateComponentGroupType;
          if (!targetGroup.isGroup) return;

          // 记录数据
          if (isHistory)
            chartHistoryStore.createUnGroupHistory(cloneDeep([targetGroup]));

          // 分离组件并还原位置属性
          targetGroup.groupList.forEach(item => {
            item.attr.x = item.attr.x + targetGroup.attr.x;
            item.attr.y = item.attr.y + targetGroup.attr.y;
            if (!callBack) {
              this.addComponentList(item);
            }
          });
          this.setTargetSelectChart(targetGroup.id);
          // 删除分组
          this.removeComponentList(targetGroup.id, false);

          if (callBack) {
            callBack(targetGroup.groupList);
          }
        };

        const targetIndex = this.fetchTargetIndex(selectGroupIdArr[0]);
        // 判断目标是否为分组父级
        if (targetIndex !== -1) {
          unGroup(targetIndex);
        }
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 锁定
     * @param status
     * @param isHistory
     * @returns
     */
    setLock(status: boolean = true, isHistory: boolean = true) {
      try {
        loadingStart();
        // 暂不支持多选
        if (this.getTargetChart.selectId.length > 1) return;

        const index: number = this.fetchTargetIndex();
        if (index !== -1) {
          // 更新状态
          const targetItem = this.getComponentList[index];
          targetItem.status.lock = status;

          // 历史记录
          if (isHistory) {
            status
              ? chartHistoryStore.createLockHistory([targetItem])
              : chartHistoryStore.createUnLockHistory([targetItem]);
          }
          this.updateComponentList(index, targetItem);
          // 锁定添加失焦效果
          if (status) this.setTargetSelectChart(undefined);
        }
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 解除锁定
     * @param isHistory
     */
    setUnLock(isHistory: boolean = true) {
      this.setLock(false, isHistory);
    },
    /**
     * 隐藏
     * @param status
     * @param isHistory
     * @returns
     */
    setHide(status: boolean = true, isHistory: boolean = true) {
      try {
        loadingStart();
        // 暂不支持多选
        if (this.getTargetChart.selectId.length > 1) return;

        const index: number = this.fetchTargetIndex();
        if (index !== -1) {
          // 更新状态
          const targetItem = this.getComponentList[index];
          targetItem.status.hide = status;

          // 历史记录
          if (isHistory) {
            status
              ? chartHistoryStore.createHideHistory([targetItem])
              : chartHistoryStore.createShowHistory([targetItem]);
          }
          this.updateComponentList(index, targetItem);

          // 隐藏添加失焦效果
          if (status) this.setTargetSelectChart(undefined);
        }
      } catch (error) {
        console.log(error);
        loadingError();
      } finally {
        loadingFinish();
      }
    },
    /**
     * 显示
     * @param isHistory
     */
    setShow(isHistory: boolean = true) {
      this.setHide(false, isHistory);
    },
  },
});
