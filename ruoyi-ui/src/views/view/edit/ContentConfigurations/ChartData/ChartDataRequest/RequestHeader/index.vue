<template>
  <div style="width: 100%">
    <el-tabs v-model="tabValue" style="width: 200px">
      <el-tab-pane
        v-for="item in RequestParamsTypeEnum"
        :key="item"
        :label="item"
        :name="item"
      />
    </el-tabs>

    <!-- header -->
    <template v-if="tabValue === RequestParamsTypeEnum.HEADER">
      <RequestHeaderTable
        :target="requestParams[tabValue]"
        @update="updateRequestParams"
      />
    </template>

    <!-- body -->
    <template v-else>
      <el-radio-group v-model="requestParamsBodyType">
        <el-radio
          v-for="bodyEnum in RequestBodyEnumList"
          :key="bodyEnum"
          :label="bodyEnum"
        >
          {{ bodyEnum }}
        </el-radio>
      </el-radio-group>

      <template v-if="requestParamsBodyType === RequestBodyEnum['NONE']">
        <el-empty description="" />
      </template>

      <template
        v-else-if="
          requestParamsBodyType === RequestBodyEnum['FORM_DATA'] ||
          requestParamsBodyType === RequestBodyEnum['X_WWW_FORM_URLENCODED']
        "
      >
        <RequestHeaderTable
          :target="
            requestParams[RequestParamsTypeEnum.BODY][requestParamsBodyType]
          "
          @update="updateRequestBodyTable"
        />
      </template>

      <!-- json  -->
      <template v-else-if="requestParamsBodyType === RequestBodyEnum['JSON']">
        <el-input
          type="textarea"
          v-model="
            requestParams[RequestParamsTypeEnum.BODY][requestParamsBodyType]
          "
          :rows="12"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, PropType } from 'vue';

import RequestHeaderTable from '../RequestHeaderTable/index.vue';
import { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d';
import {
  RequestParamsTypeEnum,
  RequestParamsObjType,
  RequestBodyEnumList,
  RequestBodyEnum,
} from '@/enums/httpEnum';

const props = defineProps({
  targetDataRequest: Object as PropType<RequestConfigType>,
});

const { requestParams, requestParamsBodyType } = toRefs(
  props.targetDataRequest as RequestConfigType,
);

const tabValue = ref<RequestParamsTypeEnum>(RequestParamsTypeEnum.BODY);

// 更新参数表格数据
const updateRequestParams = (paramsObj: RequestParamsObjType) => {
  if (tabValue.value !== RequestParamsTypeEnum.BODY) {
    requestParams.value[tabValue.value] = paramsObj;
  }
};

// 更新参数表格数据
const updateRequestBodyTable = (paramsObj: RequestParamsObjType) => {
  if (
    tabValue.value === RequestParamsTypeEnum.BODY &&
    // 仅有两种类型有 body
    (requestParamsBodyType.value === RequestBodyEnum.FORM_DATA ||
      requestParamsBodyType.value === RequestBodyEnum.X_WWW_FORM_URLENCODED)
  ) {
    requestParams.value[RequestParamsTypeEnum.BODY][
      requestParamsBodyType.value
    ] = paramsObj;
  }
};
</script>

<style lang="scss" scoped></style>
