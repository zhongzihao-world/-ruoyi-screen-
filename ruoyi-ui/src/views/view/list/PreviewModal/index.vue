<template>
  <el-dialog
    v-model="showRef"
    center
    class="view-dialog"
    style="width: 80vw; min-height: 80vh; overflow: hidden"
    :show-close="false"
    :title="cardData?.screenTitle"
    @close="handleClose"
  >
    <template #header></template>

    <iframe
      :src="previewUrl"
      frameborder="no"
      scrolling="auto"
      style="width: 80vw; height: 80vh"
    />

    <template #footer></template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, PropType } from 'vue';

import { PageEnum } from '@/enums/pageEnum';
import type { Viewtype } from '../index.d';

const props = defineProps({
  modalShow: {
    required: true,
    type: Boolean,
  },
  cardData: Object as PropType<Viewtype>,
});
const emit = defineEmits(['close', 'edit']);

const showRef = ref(false);
watch(
  () => props.modalShow,
  newValue => {
    showRef.value = newValue;
  },
  {
    immediate: true,
  },
);

const previewUrl = ref(PageEnum.VIEW_PREVIEW + '/' + props.cardData?.screenId);

const handleClose = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .card-opt {
    display: flex;
    align-items: center;
    .el-icon {
      margin-left: 8px;
      cursor: pointer;
      font-size: 22px;
    }
  }
}
</style>

<style lang="scss">
.view-dialog {
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__footer {
    display: none;
  }
}
</style>
