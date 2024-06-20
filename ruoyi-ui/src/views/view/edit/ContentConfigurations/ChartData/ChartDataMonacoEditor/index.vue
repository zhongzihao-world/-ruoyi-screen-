<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <strong>过滤器设置</strong>

        <template v-if="targetData.filter">
          <el-space>
            <el-button type="primary" size="small" @click="addFilter">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="delFilter">
              删除
            </el-button>
          </el-space>
        </template>

        <template v-else>
          <el-button type="primary" size="small" @click="addFilter">
            新增过滤器
          </el-button>
        </template>
      </div>
    </template>

    <div>
      <span class="func-keyword">function</span>
      &nbsp;&nbsp;filter(data, res)&nbsp;&nbsp;{
    </div>
    <!-- 函数体 -->
    <div style="margin-left: 1.5em">...</div>
    <div>}</div>
  </el-card>

  <!-- 弹窗 -->
  <el-dialog
    v-model="showModal"
    title="过滤器设置"
    class="chart-request-monaco-editor-modal"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <el-card>
      <div style="font-size: 16px">
        <div>
          <span class="func-keyword">function</span>
          &nbsp;&nbsp;filter(data, res)&nbsp;&nbsp;{
        </div>

        <MonacoEditor
          v-model:modelValue="filter"
          width="460px"
          height="380px"
          language="javascript"
        />

        <div>}</div>
      </div>

      <div style="display: flex; justify-content: center; margin-top: 20px">
        <el-button @click="closeFilter">取消</el-button>
        <el-button type="primary" @click="saveFilter">保存</el-button>
      </div>
    </el-card>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, toRaw } from 'vue';
import { ElMessage } from 'element-plus';
import cloneDeep from 'lodash/cloneDeep';

import { useTargetData } from '../../hooks/useTargetData.hook';
import { MonacoEditor } from '@/components/MonacoEditor';
import { toString } from '@/utils';
import { customizeHttp } from '@/api/http';

const { targetData, chartEditStore } = useTargetData();

// 受控弹窗
const showModal = ref(false);
// filter 函数模板
const filter = ref(targetData.value.filter || `return data`);
// 过滤错误标识
const errorFlag = ref(false);
// 目标静态/接口数据
const sourceData = ref<any>('');

// 动态获取数据
const fetchTargetData = async () => {
  try {
    const res = await customizeHttp(
      toRaw(targetData.value.request),
      toRaw(chartEditStore.getRequestGlobalConfig),
    );
    if (res) {
      sourceData.value = res;
      return;
    }
    window['$message'].warning('没有拿到返回值，请检查接口！');
  } catch (error) {
    console.error(error);
    window['$message'].warning('数据异常，请检查参数！');
  }
};

// 过滤结果
const filterRes = computed(() => {
  try {
    const fn = new Function('data', 'res', filter.value);
    const response = cloneDeep(sourceData.value);
    const res = fn(response?.data, response);
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    errorFlag.value = false;
    return toString(res);
  } catch (error) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    errorFlag.value = true;
    return `过滤函数错误，日志：${error}`;
  }
});

// 新增过滤器
const addFilter = () => {
  showModal.value = true;
};

// 删除过滤器
const delFilter = () => {
  targetData.value.filter = undefined;
};

// 关闭过滤器
const closeFilter = () => {
  showModal.value = false;
};

// 新增过滤器
const saveFilter = () => {
  if (errorFlag.value) {
    ElMessage.error('过滤函数错误，无法进行保存');
    return;
  }
  targetData.value.filter = filter.value;
  closeFilter();
};

watch(
  () => showModal.value,
  (newData: boolean) => {
    if (newData) {
      fetchTargetData();
      filter.value = targetData.value.filter || `return data`;
    }
  },
);
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-card {
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgb(0 0 0 / 15%);
}
.func-keyword {
  color: #b000ff;
}
</style>

<style lang="scss">
.chart-request-monaco-editor-modal {
  .el-dialog__footer {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
