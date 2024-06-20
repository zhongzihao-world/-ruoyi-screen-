<template>
  <div class="list-item" :class="{ active, 'list-text': selectText }">
    <div class="list-item-box">
      <div class="list-item-content">
        <el-image fit="contain" :src="imageInfo" />

        <el-text truncated>
          <el-tooltip :content="props.componentData.chartConfig.title">
            {{ props.componentData.chartConfig.title }}
          </el-tooltip>
        </el-text>
      </div>

      <LayersStatus :isGroup="isGroup" :status="status" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue';

import useSettingsStore from '@/store/modules/settings';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { LayerModeEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d';
import { fetchImages } from '@/packages';
import {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import LayersStatus from '../LayersStatus/index.vue';

const props = defineProps({
  componentData: {
    type: Object as PropType<CreateComponentType | CreateComponentGroupType>,
    required: true,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  layerMode: {
    type: String as PropType<LayerModeEnum>,
    default: LayerModeEnum.THUMBNAIL,
  },
});

const settingsStore = useSettingsStore();
// 颜色
const themeColor = computed(() => {
  return settingsStore.theme;
});

const chartEditStore = useChartEditStore();
const imageInfo = ref('');

// 获取图片
const fetchImageUrl = async () => {
  imageInfo.value = await fetchImages(props.componentData.chartConfig);
};
fetchImageUrl();

// 计算当前选中目标
const active = computed(() => {
  const id = props.componentData.id;
  return chartEditStore.getTargetChart.selectId.find((e: string) => e === id);
});

// 组件状态 隐藏/锁定
const status = computed(() => {
  return props.componentData.status;
});

// 是否选中文本
const selectText = computed(() => {
  return props.layerMode === LayerModeEnum.TEXT;
});
</script>

<style lang="scss" scoped>
.list-item {
  position: relative;
  margin-bottom: 4px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px dashed v-bind(themeColor);

  &.active {
    border-style: solid;

    &::after {
      content: '';
      z-index: -1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.2;
      background-color: v-bind(themeColor);
    }
  }

  &.list-text {
    padding: 5px 0;

    .list-item-content {
      height: 20px !important;
      .el-image {
        display: none;
      }
    }
  }

  .list-item-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    .list-item-content {
      display: flex;
      align-items: center;
      width: 135px;
      height: 50px;
      .el-image {
        flex-shrink: 0;
        width: 50px;
        height: 50px;
        border-radius: 12px;
      }
      .el-text {
        margin-left: 5px;
        font-size: 12px;
      }
    }
  }
}
</style>
