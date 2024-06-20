<template>
  <div>
    <el-tabs v-model="tabValue" style="width: 50px">
      <el-tab-pane
        v-for="item in tabs"
        :key="item"
        :label="item"
        :name="item"
      />
    </el-tabs>

    <!-- 这里的 v-if 是为了处理打包 ts 错类型误 -->
    <RequestHeaderTable
      v-if="tabValue === RequestParamsTypeEnum.HEADER"
      :target="requestParams[tabValue]"
      @update="updateRequestParams"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';

import { useTargetData } from '@/views/view/edit/ContentConfigurations/hooks/useTargetData.hook';
import { RequestParamsTypeEnum, RequestParamsObjType } from '@/enums/httpEnum';
import RequestHeaderTable from '../RequestHeaderTable/index.vue';

const { chartEditStore } = useTargetData();
const { requestParams } = toRefs(chartEditStore.getRequestGlobalConfig);

const tabValue = ref<RequestParamsTypeEnum>(RequestParamsTypeEnum.HEADER);
const tabs = [RequestParamsTypeEnum.HEADER];

// 更新表格参数
const updateRequestParams = (paramsObj: RequestParamsObjType) => {
  if (tabValue.value === RequestParamsTypeEnum.HEADER) {
    requestParams.value[tabValue.value] = paramsObj;
  }
};
</script>

<style lang="scss" scoped></style>
