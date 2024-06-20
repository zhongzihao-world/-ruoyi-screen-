<template>
  <el-card style="margin-bottom: 12px">
    <el-divider>组件请求配置</el-divider>

    <el-form label-width="auto" label-position="left" size="default">
      <el-form-item label="请求地址">
        <el-input v-model.trim="requestUrl" placeholder="例：/api/project/list">
          <template #prepend>
            <el-select v-model="requestHttpType" style="width: 80px">
              <el-option
                v-for="item in selectTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>

          <template #prefix>
            <span>{{ requestOriginUrl }}</span>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="请求间隔">
        <el-input
          v-model.trim="requestInterval"
          placeholder="请输入数字"
          style="width: 180px"
          :min="0"
        >
          <template #append>
            <el-select v-model="requestIntervalUnit" style="width: 60px">
              <el-option
                v-for="item in selectTimeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-input>
      </el-form-item>

      <RequestHeader :targetDataRequest="targetDataRequest" />
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue';

import {
  selectTypeOptions,
  selectTimeOptions,
} from '@/views/view/edit/ContentConfigurations/ChartData/index.d';
import { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d';
import { useTargetData } from '@/views/view/edit/ContentConfigurations/hooks/useTargetData.hook';
import RequestHeader from '../RequestHeader/index.vue';

const props = defineProps({
  targetDataRequest: Object as PropType<RequestConfigType>,
});

const { chartEditStore } = useTargetData();
const { requestOriginUrl } = toRefs(chartEditStore.getRequestGlobalConfig);
const { requestInterval, requestIntervalUnit, requestHttpType, requestUrl } =
  toRefs(props.targetDataRequest as RequestConfigType);
</script>

<style lang="scss" scoped></style>
