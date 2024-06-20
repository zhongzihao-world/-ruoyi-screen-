<template>
  <div class="app-wrapper">
    <el-container direction="vertical">
      <ContentHeader />
      <el-main>
        <div style="display: flex; flex-direction: column">
          <div class="component-box" :class="{ collapse: !getCharts }">
            <ContentCharts />
          </div>

          <div
            class="layers-box"
            :class="{ collapse: !chartLayoutStore.getCharts }"
          >
            <ContentLayers />
          </div>
        </div>

        <div class="canvas-box">
          <ContentEdit />
        </div>

        <div
          class="config-box"
          :class="{ collapse: !chartLayoutStore.getDetails }"
        >
          <ContentConfigurations />
        </div>
      </el-main>
    </el-container>
  </div>

  <ContentMenu v-if="chartEditStore.getRightMenuShow" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { loadAsyncComponent } from '@/utils';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { useChartHistoryStore } from '@/store/modules/chartHistoryStore/chartHistoryStore';
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore';
import ContentMenu from './ContentMenu/index.vue';
import { getCharts } from './ContentCharts/hooks/useAside.hook';
import { useView } from './hooks/useView.hook';

const ContentHeader = loadAsyncComponent(
  () => import('./ContentHeader/index.vue'),
);
const ContentCharts = loadAsyncComponent(
  () => import('./ContentCharts/index.vue'),
);
const ContentLayers = loadAsyncComponent(
  () => import('./ContentLayers/index.vue'),
);
const ContentEdit = loadAsyncComponent(() => import('./ContentEdit/index.vue'));
const ContentConfigurations = loadAsyncComponent(
  () => import('./ContentConfigurations/index.vue'),
);

const chartHistoryStoreStore = useChartHistoryStore();
const chartEditStore = useChartEditStore();

// 记录初始化
chartHistoryStoreStore.canvasInit(chartEditStore.getEditCanvas);
const chartLayoutStore = useChartLayoutStore();

const { initView } = useView();
// 初始化数据
onMounted(() => {
  initView();
});
</script>

<style lang="scss" scoped>
.app-wrapper {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.el-main {
  display: flex;
  height: calc(100vh - 60px);
  padding: 0;
  overflow: hidden;

  .component-box {
    margin-bottom: 12px;
    width: 300px;
    flex: 1;
    overflow: hidden;
    transition-duration: 0.2s;
    &.collapse {
      width: 60px;
    }
  }

  .layers-box {
    width: 300px;
    height: 300px;
    overflow: hidden;
    transition-duration: 0.2s;
    &.collapse {
      width: 0;
    }
  }

  .canvas-box {
    flex: 1;
    padding: 0 5px;
  }

  .config-box {
    width: 380px;
    overflow-y: auto;
    transition-duration: 0.2s;

    &.collapse {
      width: 0;
    }
  }
}
</style>
