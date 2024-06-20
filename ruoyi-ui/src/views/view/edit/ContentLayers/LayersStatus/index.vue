<template>
  <div class="layers-item-opt" v-show="!isGroup">
    <el-icon @click="showHandle">
      <component :is="status.hide ? 'View' : 'Hide'" />
    </el-icon>

    <el-icon @click="lockHandle">
      <component :is="status.lock ? 'Unlock' : 'Lock'" />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';

import { StatusType } from '@/packages/index.d';
import useSettingsStore from '@/store/modules/settings';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';

const props = defineProps({
  isGroup: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Object as PropType<StatusType>,
    default: () => ({
      lock: false,
      hide: false,
    }),
  },
});

const settingsStore = useSettingsStore();
// 颜色
const themeColor = computed(() => {
  return settingsStore.theme;
});

const chartEditStore = useChartEditStore();

// 隐藏 / 展示
const showHandle = (e: MouseEvent) => {
  e.stopPropagation();
  props.status.hide ? chartEditStore.setShow() : chartEditStore.setHide();
};

// 锁定 / 解锁
const lockHandle = (e: MouseEvent) => {
  e.stopPropagation();
  props.status.lock ? chartEditStore.setUnLock() : chartEditStore.setLock();
};
</script>

<style lang="scss" scoped>
.layers-item-opt {
  flex: 1;
  display: flex;
  justify-content: end;
  align-items: center;
  .el-icon {
    font-size: 16px;
    margin-right: 2px;
    &:hover {
      color: v-bind(themeColor);
    }
  }
}
</style>
