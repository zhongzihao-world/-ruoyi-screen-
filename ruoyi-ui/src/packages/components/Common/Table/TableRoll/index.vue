<template>
  <div class="table-roll">
    <div
      class="header"
      v-if="status.header.length && status.mergedConfig"
      :style="`color: ${status.mergedConfig.headerColor};background-color: ${status.mergedConfig.headerBgColor};`"
    >
      <div
        class="header-item"
        v-for="(headerItem, i) in status.header"
        :key="`${headerItem}${i}`"
        :style="`
        height: ${status.mergedConfig.headerHeight}px;
        line-height: ${status.mergedConfig.headerHeight}px;
        width: ${status.widths[i]}px;
      `"
        :align="status.aligns[i]"
        v-html="headerItem"
      />
    </div>

    <div
      v-if="status.mergedConfig"
      class="rows"
      :style="`height: ${
        h - (status.header.length ? status.mergedConfig.headerHeight : 0)
      }px;`"
    >
      <div
        class="row-item"
        v-for="(row, ri) in status.rows"
        :key="`${row.toString()}${row.scroll}`"
        :style="`
        height: ${status.heights[ri]}px;
        line-height: ${status.heights[ri]}px;
        color: ${
          status.mergedConfig[
            row.rowIndex % 2 === 0 ? 'evenRowColor' : 'oddRowColor'
          ]
        };
        background-color: ${
          status.mergedConfig[
            row.rowIndex % 2 === 0 ? 'evenRowBgColor' : 'oddRowBgColor'
          ]
        };
      `"
      >
        <div
          class="ceil"
          v-for="(ceil, ci) in row.ceils"
          :key="`${ceil}${ri}${ci}`"
          :style="`width: ${status.widths[ci]}px;`"
          :align="status.aligns[ci]"
          v-html="ceil"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, watch, toRefs, onMounted, onUnmounted } from 'vue';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

import type { CreateComponentType } from '@/packages/index.d';
import { useChartDataFetch } from '@/hooks';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
});

const { w, h } = toRefs(props.chartConfig.attr);
const status = reactive({
  defaultConfig: {
    /**
     * @description 表格数据
     * @type {Array<Array>}
     * @default dataset = []
     */
    dataset: undefined,
    /**
     * @description 表头
     * @type {Array<String>}
     * @default header = []
     * @example header = ['column1', 'column2', 'column3']
     */
    header: undefined,
    /**
     * @description 表头高度
     * @type {Number}
     * @default headerHeight = 35
     */
    headerHeight: undefined,
    /**
     * @description 展示行数
     * @type {Number}
     * @default rowNum = 5
     */
    rowNum: undefined,
    /**
     * @description 列宽
     * @type {Array<Number>}
     * @default columnWidth = []
     */
    columnWidth: undefined,
    /**
     * @description 对齐方式
     * @type {Array<String>}
     * @default align = []
     * @example align = ['left', 'center', 'right']
     * 修改为 string
     */
    align: undefined,
    /**
     * @description 是否展示序号
     * @type {Boolean}
     * @default index = false
     */
    index: undefined,
    /**
     * @description index Header
     * @type {String}
     * @default indexHeader = '#'
     */
    indexHeader: '#',
    /**
     * @description Pause scroll when mouse hovered
     * @type {Boolean}
     * @default hoverPause = true
     * @example hoverPause = true | false
     */
    hoverPause: true,

    /**
     * @description 滚动方式
     * @type {String}
     * @default carousel = 'single'
     * @example carousel = 'single' | 'page'
     */
    carousel: undefined,
    /**
     * @description 间隔时间
     * @type {Number}
     * @default waitTime = 2
     */
    waitTime: '',

    /**
     * @description 表头 background color
     * @type {String}
     */
    headerBgColor: undefined,
    headerColor: undefined,
    /**
     * @description 奇数行 background color
     * @type {String}
     */
    oddRowBgColor: undefined,
    oddRowColor: undefined,
    /**
     * @description 偶数行 background color
     * @type {String}
     */
    evenRowBgColor: undefined,
    evenRowColor: undefined,

  },

  mergedConfig: props.chartConfig.option,
  header: [],
  rowsData: [],
  rows: [
    {
      ceils: [],
      rowIndex: 0,
      scroll: 0,
    },
  ],
  widths: [],
  heights: [0],
  avgHeight: 0,
  aligns: [],
  animationIndex: 0,
  animationHandler: 0,
  updater: 0,
  needCalc: false,
});
// 合并配置
const mergeConfig = () => {
  status.mergedConfig = merge(
    cloneDeep(status.defaultConfig),
    props.chartConfig.option,
  );
};

const calcData = () => {
  try {
    mergeConfig();
    calcHeaderData();
    calcRowsData();
    calcWidths();
    calcHeights();
    calcAligns();
    animation(true);
  } catch (e) {
    console.log(e);
  }
};

onMounted(() => {
  calcData();
});
onUnmounted(() => {
  stopAnimation();
});

const calcHeaderData = () => {
  let { header, index, indexHeader } = status.mergedConfig;
  if (!header.length) {
    status.header = [];
    return;
  }
  header = [...header];
  if (index) header.unshift(indexHeader);
  status.header = header;
};

const calcRowsData = () => {
  let { dataset, index, headerBgColor, rowNum } = status.mergedConfig;
  if (index) {
    dataset = dataset.map((row: any, i: number) => {
      row = [...row];
      const indexTag = `<span class="index" style="color: ${status.mergedConfig.headerColor};background-color: ${headerBgColor};border-radius: 3px;padding: 0px 3px;">${
        i + 1
      }</span>`;
      row.unshift(indexTag);
      return row;
    });
  }
  dataset = dataset.map((ceils: any, i: number) => ({ ceils, rowIndex: i }));
  const rowLength = dataset.length;
  if (rowLength > rowNum && rowLength < 2 * rowNum) {
    dataset = [...dataset, ...dataset];
  }
  dataset = dataset.map((d: any, i: number) => ({ ...d, scroll: i }));

  status.rowsData = dataset;
  status.rows = dataset;
};

const calcWidths = () => {
  const { mergedConfig, rowsData } = status;
  const { columnWidth, header } = mergedConfig;
  const usedWidth = columnWidth.reduce((all: any, ws: number) => all + ws, 0);
  let columnNum = 0;
  if (rowsData[0]) {
    columnNum = (rowsData[0] as any).ceils.length;
  } else if (header.length) {
    columnNum = header.length;
  }
  const avgWidth = (w.value - usedWidth) / (columnNum - columnWidth.length);
  const widths = new Array(columnNum).fill(avgWidth);
  status.widths = merge(widths, columnWidth);
};

const calcHeights = (onresize = false) => {
  const { mergedConfig, header } = status;
  const { headerHeight, rowNum, dataset } = mergedConfig;
  let allHeight = h.value;
  if (header.length) allHeight -= headerHeight;
  const avgHeight = allHeight / rowNum;
  status.avgHeight = avgHeight;
  if (!onresize) status.heights = new Array(dataset.length).fill(avgHeight);
};

const calcAligns = () => {
  const { header, mergedConfig } = status;

  const columnNum = header.length;

  const { align } = mergedConfig;
  let aligns = new Array(columnNum).fill(align);
  status.aligns = merge(aligns);
};

const animation = async (start = false) => {
  const { needCalc } = status;

  if (needCalc) {
    calcRowsData();
    calcHeights();
    status.needCalc = false;
  }
  let { avgHeight, animationIndex, mergedConfig, rowsData, updater } = status;
  const { waitTime, carousel, rowNum } = mergedConfig;

  const rowLength = rowsData.length;
  if (rowNum >= rowLength) return;
  if (start) {
    await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
    if (updater !== status.updater) return;
  }
  const animationNum = carousel === 'single' ? 1 : rowNum;
  let rows = rowsData.slice(animationIndex);
  rows.push(...rowsData.slice(0, animationIndex));
  status.rows = rows.slice(0, carousel === 'page' ? rowNum * 2 : rowNum + 1);
  status.heights = new Array(rowLength).fill(avgHeight);
  await new Promise(resolve => setTimeout(resolve, 300));
  if (updater !== status.updater) return;
  status.heights.splice(0, animationNum, ...new Array(animationNum).fill(0));
  animationIndex += animationNum;
  const back = animationIndex - rowLength;
  if (back >= 0) animationIndex = back;
  status.animationIndex = animationIndex;
  status.animationHandler = setTimeout(animation, waitTime * 1000 - 300) as any;
};

const stopAnimation = () => {
  status.updater = (status.updater + 1) % 999999;
  if (!status.animationHandler) return;
  clearTimeout(status.animationHandler);
};

const onRestart = async () => {
  try {
    if (!status.mergedConfig) return;
    stopAnimation();
    calcData();
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => w.value,
  () => {
    onRestart();
  },
);
watch(
  () => h.value,
  () => {
    onRestart();
  },
);
// 数据更新
watch(
  () => props.chartConfig.option,
  () => {
    onRestart();
  },
  { deep: true },
);

// 数据更新 (默认更新 dataset，若更新之后有其它操作，可添加回调函数)
useChartDataFetch(props.chartConfig, useChartEditStore, (resData: any[]) => {
  props.chartConfig.option.dataset = resData;
  onRestart();
});
</script>

<style lang="scss" scoped>
.table-roll {
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;

  .text {
    padding: 0 10px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header {
    display: flex;
    flex-direction: row;
    font-size: 15px;

    .header-item {
      transition: all 0.3s;
    }
  }

  .rows {
    overflow: hidden;

    .row-item {
      display: flex;
      font-size: 14px;
      transition: all 0.3s;
      overflow: hidden;
    }
  }
}
</style>
