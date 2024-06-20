<template>
  <el-space>
    <el-dropdown @command="handleCommand" trigger="click">
      <el-button type="text">
        导出
        <el-icon><CaretBottom /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="exportImg">
            <span>图片</span>
          </el-dropdown-item>
          <el-dropdown-item divided command="exportJSON">
            <span>设计文件</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-button
      v-for="item in btnList"
      :key="item.label"
      :type="item.type"
      :icon="item.icon"
      @click="item.event"
    >
      {{ item.label }}
    </el-button>
  </el-space>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';

import { exportImageHandle, exportJSONHandle } from './index';

import { useView } from '@/views/view/edit/hooks/useView.hook';

const handleCommand = (command: string) => {
  switch (command) {
    case 'importJSON':
      break;
    case 'exportImg':
      exportImageHandle();
      break;
    case 'exportJSON':
      ElMessage.info('敬请期待');
      // exportJSONHandle();
      break;
    default:
      break;
  }
};

const { savePagecover, saveView, goPreviewPage } = useView();

// 保存
const savePageCoverHandle = async () => {
  savePagecover();
};
// 保存
const saveHandle = async () => {
  saveView();
};
// 预览
const previewHandle = async () => {
  await saveView();
  setTimeout(() => {
    goPreviewPage();
  });
};

const btnList = [
  {
    label: '更新封面',
    type: '',
    icon: 'Picture',
    event: savePageCoverHandle,
  },
  {
    label: '保存',
    type: 'primary',
    icon: 'Select',
    event: saveHandle,
  },
  {
    label: '预览',
    type: 'success',
    icon: 'View',
    event: previewHandle,
  },
];
</script>

<style lang="scss" scoped></style>
