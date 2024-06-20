<template>
  <div class="chart-data-ajax">
    <el-form label-width="auto" label-position="left" size="default">
      <el-card>
        <template #header>
          <div class="card-header">
            <strong>接口设置</strong>

            <el-space>
              <el-button
                type="primary"
                size="small"
                @click="requestModelHandle"
              >
                编辑
              </el-button>

              <el-button type="success" size="small" @click="sendHandle">
                测试请求
              </el-button>
            </el-space>
          </div>
        </template>

        <el-form-item label="请求类型">
          <el-input
            :placeholder="targetData.request.requestHttpType"
            disabled
          />
        </el-form-item>

        <el-form-item label="全局地址">
          <el-input :placeholder="requestOriginUrl" disabled />
        </el-form-item>
        <el-form-item label="全局间隔">
          <el-input :placeholder="GlobalRequestInterval" disabled>
            <template #suffix>
              {{ SelectHttpTimeNameObj[GlobalRequestIntervalUnit] }}
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="请求地址">
          <el-input :placeholder="targetData.request.requestUrl" disabled />
        </el-form-item>
        <el-form-item label="请求间隔">
          <el-input :placeholder="targetData.request.requestInterval" disabled>
            <template #suffix>
              {{
                SelectHttpTimeNameObj[targetData.request.requestIntervalUnit]
              }}
            </template>
          </el-input>
        </el-form-item>
      </el-card>
    </el-form>

    <ChartDataMatchingAndShow :ajax="true" />

    <!-- 请求配置 model -->
    <ChartDataRequest
      v-model:modelShow="requestShow"
      :targetData="targetData"
      @sendHandle="sendHandle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeUnmount, watchEffect, toRaw } from 'vue';
import { ElMessage } from 'element-plus';

import { SelectHttpTimeNameObj } from '@/enums/httpEnum';
import { customizeHttp } from '@/api/http';
import { newFunctionHandle } from '@/utils';
import ChartDataMatchingAndShow from '../ChartDataMatchingAndShow/index.vue';
import ChartDataRequest from '../ChartDataRequest/index.vue';
import { useTargetData } from '../../hooks/useTargetData.hook';

const { targetData, chartEditStore } = useTargetData();

const {
  requestOriginUrl,
  requestInterval: GlobalRequestInterval,
  requestIntervalUnit: GlobalRequestIntervalUnit,
} = toRefs(chartEditStore.getRequestGlobalConfig);

// 是否展示数据分析
const loading = ref(false);
const requestShow = ref(false);
const showMatching = ref(false);

let firstFocus = 0;
let lastFilter: any = undefined;

// 请求配置 model
const requestModelHandle = () => {
  requestShow.value = true;
};

// 发送请求
const sendHandle = async () => {
  if (!targetData.value?.request) return;
  loading.value = true;
  try {
    const res = await customizeHttp(
      toRaw(targetData.value.request),
      toRaw(chartEditStore.getRequestGlobalConfig),
    );
    loading.value = false;
    if (res) {
      if (!res?.data && !targetData.value.filter)
        ElMessage.error('您的数据不符合默认格式，请配置过滤器！');
      targetData.value.option.dataset = newFunctionHandle(
        res?.data,
        res,
        targetData.value.filter,
      );
      showMatching.value = true;
      return;
    }
    ElMessage.error('没有拿到返回值，请检查接口！');
  } catch (error) {
    console.error(error);
    loading.value = false;
    ElMessage.error('数据异常，请检查参数！');
  }
};

watchEffect(() => {
  const filter = targetData.value?.filter;
  if (lastFilter !== filter && firstFocus) {
    lastFilter = filter;
    sendHandle();
  }
  firstFocus++;
});

onBeforeUnmount(() => {
  lastFilter = null;
});
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
</style>
