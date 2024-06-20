<template>
  <!-- 通用配置 -->
  <EchartsSetting :optionData="optionData" />

  <el-divider content-position="center">
    <strong>数据项配置</strong>
  </el-divider>

  <el-form-item label="标签">
    <FormSettingBox>
      <FormSettingItem name="">
        <div style="display: flex; align-items: center">
          <el-switch v-model="series.label.show" />
          <span style="margin-left: 5px">是否显示</span>
        </div>
      </FormSettingItem>

      <FormSettingItem name="颜色">
        <el-color-picker
          v-model="series.label.color"
          :show-alpha="true"
          :predefine="colorsPicker"
          @active-change="(val: string) => (series.label.color = val)"
        />
      </FormSettingItem>

      <FormSettingItem name="大小">
        <el-input-number v-model="series.label.fontSize" :min="1" />
      </FormSettingItem>
    </FormSettingBox>
  </el-form-item>
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

const series = computed(() => {
  return props.optionData.series[0];
});
</script>

<style lang="scss" scoped></style>
