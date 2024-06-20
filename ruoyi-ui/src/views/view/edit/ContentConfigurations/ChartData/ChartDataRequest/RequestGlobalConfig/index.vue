<template>
  <el-card style="margin-bottom: 12px">
    <el-divider>全局请求配置</el-divider>

    <el-form label-width="auto" label-position="left" size="default">
      <el-form-item label="前缀URL">
        <el-input
          v-model="requestOriginUrl"
          placeholder="例：http://ac.gree.com"
        />
      </el-form-item>

      <el-form-item label="请求间隔">
        <el-input
          v-model:value.trim="requestInterval"
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
    </el-form>

    <RequestGlobalHeader />
  </el-card>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

import { useTargetData } from '@/views/view/edit/ContentConfigurations/hooks/useTargetData.hook';
import { selectTimeOptions } from '@/views/view/edit/ContentConfigurations/ChartData/index.d';
import RequestGlobalHeader from '../RequestGlobalHeader/index.vue';

const { chartEditStore } = useTargetData();
const { requestOriginUrl, requestInterval, requestIntervalUnit } = toRefs(
  chartEditStore.getRequestGlobalConfig,
);
</script>

<style lang="scss" scoped></style>
