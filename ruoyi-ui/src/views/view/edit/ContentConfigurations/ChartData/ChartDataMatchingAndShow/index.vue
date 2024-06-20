<template>
  <div>
    <ChartDataMonacoEditor v-if="filterShow" />

    <el-space alignment="center">
      <el-upload
        v-model:file-list="uploadFileListRef"
        :accept="['.json']"
        :show-file-listt="false"
        :http-request="customRequest"
      >
        <el-button type="primary">导入json文件</el-button>
      </el-upload>

      <el-button type="primary" plain @click="download">下载数据</el-button>
    </el-space>

    <el-table
      ref="tableRef"
      style="margin-top: 12px"
      :data="dimensions"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="数据维度">
        <template #default="scope">
          {{ scope.row }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import { toString } from '@/utils';
import { RequestDataTypeEnum } from '@/enums/httpEnum';
import { useFile } from '../hooks/useFile.hooks';
import { useTargetData } from '../../hooks/useTargetData.hook';
import ChartDataMonacoEditor from '../ChartDataMonacoEditor/index.vue';

defineProps({
  ajax: {
    type: Boolean,
    required: true,
  },
});

const { targetData } = useTargetData();

let dimensions = ref<string[]>([]);
let selectList = ref<string[]>([]);
const tableRef = ref<any>();
const handleSelectionChange = (val: string[]) => {
  // console.log(val);
  selectList.value = val;
  targetData.value.option.dataset = {
    ...targetData.value.option.dataset,
    dimensions: dimensions.value.filter((o: string) =>
      selectList.value.includes(o),
    ),
  };
};
const init = () => {
  const dataset = targetData.value.option.dataset;
  dimensions.value = dataset?._dimensions || dataset?.dimensions || [];
  // 诡异bug
  setTimeout(() => {
    selectList.value = dataset?.dimensions || [];
    selectList.value.forEach((row: any) => {
      tableRef.value.toggleRowSelection(row, true);
    });
  });
};

const { uploadFileListRef, customRequest, download } = useFile(
  targetData,
  init,
);

// 是否展示过滤器
const filterShow = computed(() => {
  return (
    targetData.value.request.requestDataType !== RequestDataTypeEnum.STATIC
  );
});

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
:deep(.el-upload-list) {
  display: none;
}

:deep(pre) {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
