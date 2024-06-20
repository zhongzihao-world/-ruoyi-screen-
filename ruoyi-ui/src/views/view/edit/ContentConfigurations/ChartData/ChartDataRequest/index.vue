<template>
  <el-dialog
    v-model="modelShowRef"
    class="chart-request-modal"
    :width="800"
    :show-close="false"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <template #header></template>

    <!-- 全局配置 -->
    <RequestGlobalConfig />

    <!-- 组件配置 -->
    <RequestConfig :target-data-request="targetData?.request" />

    <template #footer>
      <div style="text-align: center">
        <el-button type="primary" @click="closeAndSendHandle">
          保存配置
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script script lang="ts" setup>
import { ref, PropType, watch } from 'vue';

import { CreateComponentType } from '@/packages/index.d';
import RequestGlobalConfig from './RequestGlobalConfig/index.vue';
import RequestConfig from './RequestConfig/index.vue';

const props = defineProps({
  modelShow: Boolean,
  targetData: Object as PropType<CreateComponentType>,
});
const emit = defineEmits(['update:modelShow', 'sendHandle']);

const modelShowRef = ref(false);

watch(
  () => props.modelShow,
  newValue => {
    modelShowRef.value = newValue;
  },
  {
    immediate: true,
  },
);

const handleClose = () => {
  emit('update:modelShow', false);
};

const closeAndSendHandle = () => {
  emit('update:modelShow', false);
  emit('sendHandle');
};
</script>

<style lang="scss" scoped>
.chart-request-modal {
}
</style>

<style lang="scss">
.chart-request-modal {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
