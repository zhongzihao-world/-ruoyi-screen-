<template>
  <el-form-item label="表格配置">
    <FormSettingBox alone>
      <FormSettingItem name="对齐方式">
        <el-radio-group v-model="optionData.align">
          <el-radio-button
            v-for="item in alignList"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </FormSettingItem>
    </FormSettingBox>

    <FormSettingBox alone>
      <FormSettingItem name="滚动方式">
        <el-radio-group v-model="optionData.carousel">
          <el-radio-button
            v-for="item in animateList"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </FormSettingItem>
    </FormSettingBox>

    <FormSettingBox>
      <FormSettingItem name="展示行数">
        <el-input-number v-model="optionData.rowNum" :min="1" />
      </FormSettingItem>

      <FormSettingItem name="间隔(秒)">
        <el-input-number v-model="optionData.waitTime" :min="1" />
      </FormSettingItem>
    </FormSettingBox>
  </el-form-item>

  <el-form-item label="表头">
    <FormSettingBox>
      <FormSettingItem name="表头高度">
        <el-input-number v-model="optionData.headerHeight" :min="1" />
      </FormSettingItem>
    </FormSettingBox>

    <FormSettingBox>
      <FormSettingItem name="背景颜色">
        <el-color-picker
          v-model="optionData.headerBgColor"
          :show-alpha="true"
          :predefine="colorsPicker"
          @active-change="(val: string) => (optionData.headerBgColor = val)"
        />
      </FormSettingItem>

      <FormSettingItem name="字体颜色">
        <el-color-picker
          v-model="optionData.headerColor"
          :show-alpha="true"
          :predefine="colorsPicker"
          @active-change="(val: string) => (optionData.headerColor = val)"
        />
      </FormSettingItem>
    </FormSettingBox>
  </el-form-item>

  <el-form-item label="奇数行">
    <FormSettingBox>
      <FormSettingItem name="背景颜色">
        <el-color-picker
          v-model="optionData.oddRowBgColor"
          :show-alpha="true"
          :predefine="colorsPicker"
          @active-change="(val: string) => (optionData.oddRowBgColor = val)"
        />
      </FormSettingItem>

      <FormSettingItem name="字体颜色">
        <el-color-picker
          v-model="optionData.oddRowColor"
          :show-alpha="true"
          :predefine="colorsPicker"
          @active-change="(val: string) => (optionData.oddRowColor = val)"
        />
      </FormSettingItem>
    </FormSettingBox>
  </el-form-item>

  <el-form-item label="偶数行">
    <FormSettingBox>
      <FormSettingItem name="背景颜色">
        <el-color-picker
          v-model="optionData.evenRowBgColor"
          :show-alpha="true"
          :predefine="colorsPicker"
          @active-change="(val: string) => (optionData.evenRowBgColor = val)"
        />
      </FormSettingItem>

      <FormSettingItem name="字体颜色">
        <el-color-picker
          v-model="optionData.evenRowColor"
          :show-alpha="true"
          :predefine="colorsPicker"
          @active-change="(val: string) => (optionData.evenRowColor = val)"
        />
      </FormSettingItem>
    </FormSettingBox>
  </el-form-item>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';

import FormSettingBox from '@/components/FormSettingBox/index.vue';
import FormSettingItem from '@/components/FormSettingBox/item.vue';
import { colorsPicker } from '@/config';
import { option } from './config';

defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});

const animateList = [
  { label: '单条滚动', value: 'single' },
  { label: '整页滚动', value: 'page' },
];
const alignList = [
  { label: '居左', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '居右', value: 'right' },
];
</script>

<style lang="scss" scoped></style>
