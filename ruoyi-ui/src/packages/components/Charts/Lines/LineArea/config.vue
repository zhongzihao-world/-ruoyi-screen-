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

    <el-form-item label="线条">
      <FormSettingBox>
        <FormSettingItem name="大小">
          <el-input-number v-model="series.lineStyle.width" :min="0" />
        </FormSettingItem>

        <FormSettingItem name="颜色">
          <el-color-picker
            v-model="series.lineStyle.color"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => (series.lineStyle.color = val)"
          />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>

    <el-form-item label="点大小">
      <el-input-number v-model="series.symbolSize" :min="0" />
    </el-form-item>

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
          <el-input-number v-model="series.label.fontSize" :min="0" />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>

    <el-form-item label="是否平滑">
      <el-switch v-model="series.smooth" />
    </el-form-item>

    <el-form-item label="堆叠面积">
      <FormSettingBox>
        <FormSettingItem name="颜色">
          <el-color-picker
            v-model="series.areaStyle.color"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => (series.areaStyle.color = val)"
          />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>
  </el-collapse-item>
</template>

<script setup lang="ts">
import { PropType, computed, watch } from 'vue';

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
