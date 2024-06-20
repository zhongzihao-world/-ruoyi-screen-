<template>
  <el-form-item label="文本内容">
    <el-input v-model="optionData.dataset" />
  </el-form-item>

  <el-form-item label="文本设置">
    <FormSettingBox>
      <FormSettingItem name="大小">
        <el-input-number v-model="optionData.fontSize" />
      </FormSettingItem>

      <FormSettingItem name="间距">
        <el-input-number v-model="optionData.letterSpacing" />
      </FormSettingItem>
    </FormSettingBox>
  </el-form-item>

  <el-form-item label="文本颜色">
    <FormSettingBox>
      <FormSettingItem name="起始">
        <el-color-picker
          v-model="optionData.color.from"
          :show-alpha="true"
          :predefine="colorsPicker"
          @active-change="(val: string) => (optionData.color.from = val)"
        />
      </FormSettingItem>

      <FormSettingItem name="结束">
        <el-color-picker
          v-model="optionData.color.to"
          :show-alpha="true"
          :predefine="colorsPicker"
          @active-change="(val: string) => (optionData.color.to = val)"
        />
      </FormSettingItem>

      <FormSettingItem name="偏移角度">
        <el-input-number v-model="optionData.color.deg" />
      </FormSettingItem>
    </FormSettingBox>
  </el-form-item>

  <el-form-item label="水平对齐">
    <el-radio-group v-model="optionData.textAlignX">
      <el-radio-button
        v-for="item in horizontal"
        :key="item.value"
        :label="item.value"
      >
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
  </el-form-item>

  <el-form-item label="垂直对齐">
    <el-radio-group v-model="optionData.textAlignY">
      <el-radio-button
        v-for="item in vertical"
        :key="item.value"
        :label="item.value"
      >
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
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

const horizontal = [
  { label: '居左', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '居右', value: 'right' },
];

const vertical = [
  { label: '顶端', value: 'start' },
  { label: '居中', value: 'center' },
  { label: '底端', value: 'end' },
];
</script>

<style lang="scss" scoped></style>
