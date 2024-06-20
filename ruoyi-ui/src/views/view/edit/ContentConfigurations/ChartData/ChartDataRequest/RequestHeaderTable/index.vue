<template>
  <el-table :data="tableArray.content">
    <el-table-column type="index" width="50" />
    <el-table-column label="Key">
      <template #default="scope">
        <el-input v-model="scope.row.key" type="text" @blur="blur" />
      </template>
    </el-table-column>
    <el-table-column label="Value">
      <template #default="scope">
        <el-input v-model="scope.row.value" type="text" @blur="blur" />
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template #default="scope">
        <el-button
          type="primary"
          icon="Plus"
          circle
          @click="add(scope.$index)"
        />
        <el-button
          type="danger"
          icon="Delete"
          circle
          :disabled="scope.$index === 0"
          @click="remove(scope.$index)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { PropType, reactive, watch } from 'vue';

import { RequestParamsObjType } from '@/enums/httpEnum';

const emits = defineEmits(['update']);

const props = defineProps({
  target: {
    type: Object as PropType<RequestParamsObjType>,
    required: true,
    default: () => {},
  },
  editDisabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// 默认表格
const defaultItem = {
  key: '',
  value: '',
  error: false,
};
const tableArray = reactive<{
  content: (typeof defaultItem)[];
}>({ content: [] });

// 失焦
const blur = () => {
  let successNum = 0;
  tableArray.content.forEach(item => {
    if (
      (item.key !== '' && item.value == '') ||
      (item.key === '' && item.value !== '')
    ) {
      // 错误
      item.error = true;
    } else {
      // 正确
      successNum++;
      item.error = false;
    }
  });
  // 验证是否全部通过
  if (successNum == tableArray.content.length) {
    // 转换数据成对象
    const updateObj: any = {};
    tableArray.content.forEach((e: typeof defaultItem) => {
      if (e.key) updateObj[e.key] = e.value;
    });
    emits('update', updateObj);
  }
};

// 新增
const add = (index: number) => {
  tableArray.content.splice(index + 1, 0, {
    key: '',
    value: '',
    error: false,
  });
};

// 减少
const remove = (index: number) => {
  if (tableArray.content.length !== 1) {
    tableArray.content.splice(index, 1);
  }
  blur();
};

// 监听选项
watch(
  () => props.target,
  (target: RequestParamsObjType) => {
    tableArray.content = [];
    for (const k in target) {
      tableArray.content.push({
        key: k,
        value: target[k],
        error: false,
      });
    }
    // 默认值
    if (!tableArray.content.length)
      tableArray.content = [JSON.parse(JSON.stringify(defaultItem))];
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>

<style lang="scss"></style>
