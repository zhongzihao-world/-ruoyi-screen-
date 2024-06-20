<template>
  <el-space>
    <el-text @click="handleFocus">
      <el-button v-show="!focus" type="text">
        {{ pageTitle }}

        <el-icon style="margin-left: 5px">
          <Edit />
        </el-icon>
      </el-button>
    </el-text>

    <el-input
      v-show="focus"
      ref="inputRef"
      placeholder="请输入页面标题"
      v-model="title"
      show-word-limit
      :maxlength="20"
      @keyup.enter="handleBlur"
      @blur="handleBlur"
    />
  </el-space>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { EditCanvasConfigEnum } from '@/store/modules/chartEditStore/chartEditStore.d';
import { setPageTitle } from '@/utils/dynamicTitle';

const chartEditStore = useChartEditStore();

const focus = ref<boolean>(false);
const inputRef = ref(null);

const title = ref<string>(chartEditStore.editCanvasConfig.projectName || '');

const pageTitle = computed(() => {
  const newTitle = title.value ? title.value : '暂无标题';

  chartEditStore.setEditCanvasConfig(
    EditCanvasConfigEnum.PROJECT_NAME,
    newTitle,
  );
  setPageTitle(newTitle);

  return newTitle;
});

const handleFocus = () => {
  focus.value = true;
  nextTick(() => {
    inputRef.value && (inputRef.value as any).focus();
  });
};

const handleBlur = () => {
  focus.value = false;
};
</script>
<style lang="scss" scoped></style>
