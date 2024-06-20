<template>
  <!-- 通用配置 -->
  <EchartsSetting :optionData="optionData" />

  <el-divider content-position="center">
    <strong>数据项配置</strong>
  </el-divider>

  <el-collapse-item v-for="(series, index) in seriesList" :key="index">
    <template #title>
      <span class="collapse-tit">数据项 {{ index + 1 }}</span>
    </template>

    <el-form-item label="散点">
      <FormSettingBox>
        <FormSettingItem name="大小">
          <el-input-number v-model="series.symbolSize" :min="1" />
        </FormSettingItem>

        <FormSettingItem name="颜色">
          <el-color-picker
            v-model="series.itemStyle.color"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => (series.itemStyle.color = val)"
          />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>

    <el-form-item label="大数据优化">
      <FormSettingBox>
        <el-switch v-model="series.large" />

        <FormSettingItem name="阈值">
          <el-input-number v-model="series.largeThreshold" :min="100" />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>
  </el-collapse-item>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';

import FormSettingBox from '@/components/FormSettingBox/index.vue';
import FormSettingItem from '@/components/FormSettingBox/item.vue';
import EchartsSetting from '@/components/EchartsSetting/index.vue';
import { GlobalThemeJsonType } from '@/settings/chartThemes/index';
import { colorsPicker } from '@/config';

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true,
  },
});

const seriesList = computed(() => {
  return props.optionData.series || [];
});
</script>

<style lang="scss" scoped></style>
