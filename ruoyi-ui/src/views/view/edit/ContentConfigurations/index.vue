<template>
  <!-- 页面配置 -->
  <template v-if="!selectTarget">
    <template v-for="item in globalTabList" :key="item.key">
      <el-divider>
        <strong>{{ item.title }}</strong>
      </el-divider>

      <component :is="item.render" />
    </template>
  </template>

  <!-- 组件配置 -->
  <template v-else>
    <el-radio-group v-model="selectTab" @change="handleTabChange">
      <el-radio-button
        v-for="item in selectTarget.isGroup
          ? chartsDefaultTabList
          : chartsTabList"
        :key="item.key"
        :label="item.key"
      >
        <span>{{ item.title }}</span>
        <el-icon size="16">
          <component :is="item.icon" />
        </el-icon>
      </el-radio-button>
    </el-radio-group>

    <component :key="selectTarget.id" :is="selectTabKey" />
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { loadAsyncComponent } from '@/utils';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { TabsEnum } from './index.d';

const PageSetting = loadAsyncComponent(() => import('./PageSetting/index.vue'));
const ChartSetting = loadAsyncComponent(
  () => import('./ChartSetting/index.vue'),
);
const ChartData = loadAsyncComponent(() => import('./ChartData/index.vue'));

const chartEditStore = useChartEditStore();
const selectTarget = computed(() => {
  const selectId = chartEditStore.getTargetChart.selectId;
  // 排除多个
  if (selectId.length !== 1) return undefined;
  const target =
    chartEditStore.componentList[chartEditStore.fetchTargetIndex()];
  if (target?.isGroup) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    selectTab.value = TabsEnum.CHART_SETTING;
  }
  return target;
});

// 页面配置
const globalTabList = [
  {
    key: TabsEnum.PAGE_SETTING,
    title: '页面配置',
    icon: 'Setting',
    render: PageSetting,
  },
];
// 组件配置
const chartsDefaultTabList = [
  {
    key: TabsEnum.CHART_SETTING,
    title: '属性',
    icon: 'Setting',
    render: ChartSetting,
  },
];
const chartsTabList = [
  ...chartsDefaultTabList,
  {
    key: TabsEnum.CHART_DATA,
    title: '数据',
    icon: 'Coin',
    render: ChartData,
  },
];

const selectTab = ref<TabsEnum>(TabsEnum.CHART_SETTING);
const selectTabKey = computed(() => {
  return (
    chartsTabList.filter(o => o.key === selectTab.value)[0].render ??
    PageSetting
  );
});
const handleTabChange = (val: TabsEnum) => {
  selectTab.value = val;
};
</script>

<style lang="scss" scoped>
.el-radio-group {
  width: 100%;
  .el-radio-button {
    flex: 1;
    :deep(.el-radio-button__inner) {
      width: 100%;
    }
  }
}

// 让组件撑满
:deep(.el-input-number) {
  width: 100%;
}
:deep(.el-color-picker) {
  width: 100%;
  .el-color-picker__trigger {
    width: 100%;
    .el-color-picker__icon {
      display: none;
    }
  }
}
</style>
