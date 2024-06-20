<template>
  <el-space spacer="|">
    <el-button type="text" @click="goHomeHandle()">返回首页</el-button>

    <el-space>
      <el-tooltip v-for="item in btnList" :key="item.key" :content="item.title">
        <el-button plain :type="styleHandle(item)" @click="clickHandle(item)">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip
        v-for="item in historyList"
        :key="item.key"
        :content="item.title"
      >
        <el-button
          plain
          :disabled="!item.select"
          @click="clickHistoryHandle(item)"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
        </el-button>
      </el-tooltip>
    </el-space>
  </el-space>
</template>

<script setup lang="ts">
import { toRefs, Ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { useChartHistoryStore } from '@/store/modules/chartHistoryStore/chartHistoryStore';
import { HistoryStackEnum } from '@/store/modules/chartHistoryStore/chartHistoryStore.d';
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore';
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d';

const router = useRouter();
const { setItem } = useChartLayoutStore();
const { getLayers, getCharts, getDetails } = toRefs(useChartLayoutStore());
const chartEditStore = useChartEditStore();
const chartHistoryStore = useChartHistoryStore();

interface ItemType<T> {
  key: T;
  select: Ref<boolean> | boolean;
  title: string;
  icon: any;
}

const btnList = reactive<ItemType<ChartLayoutStoreEnum>[]>([
  // {
  //   key: ChartLayoutStoreEnum.LAYERS,
  //   select: getLayers,
  //   title: '图层控制',
  //   icon: 'Picture',
  // },
  {
    key: ChartLayoutStoreEnum.CHARTS,
    select: getCharts,
    title: '组件区域',
    icon: 'Picture',
  },
  {
    key: ChartLayoutStoreEnum.DETAILS,
    select: getDetails,
    title: '设置区域',
    icon: 'Setting',
  },
]);

const isBackStack = computed(() => chartHistoryStore.getBackStack.length > 1);

const isForwardStack = computed(
  () => chartHistoryStore.getForwardStack.length > 0,
);

const historyList = reactive<ItemType<HistoryStackEnum>[]>([
  {
    key: HistoryStackEnum.BACK_STACK,
    // 一定会有初始化画布
    select: isBackStack,
    title: '后退',
    icon: 'Back',
  },
  {
    key: HistoryStackEnum.FORWARD_STACK,
    select: isForwardStack,
    title: '前进',
    icon: 'Right',
  },
]);

const styleHandle = (item: ItemType<ChartLayoutStoreEnum>) => {
  if (item.key === ChartLayoutStoreEnum.DETAILS) {
    return item.select ? '' : 'primary';
  }
  return item.select ? 'primary' : '';
};

// 布局处理
const clickHandle = (item: ItemType<ChartLayoutStoreEnum>) => {
  setItem(item.key, !item.select);
};

// 历史记录处理
const clickHistoryHandle = (item: ItemType<HistoryStackEnum>) => {
  switch (item.key) {
    case HistoryStackEnum.BACK_STACK:
      chartEditStore.setBack();
      break;
    case HistoryStackEnum.FORWARD_STACK:
      chartEditStore.setForward();
      break;
  }
};

// 返回首页
const goHomeHandle = async () => {
  await ElMessageBox.confirm('将返回首页，请确认已保存页面数据');
  router.push('/');
};
</script>

<style lang="scss" scoped></style>
