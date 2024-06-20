<template>
  <el-collapse-item>
    <template #title>
      <span class="collapse-tit">属性设置</span>
    </template>

    <el-form-item label="动画时间">
      <FormSettingBox alone>
        <FormSettingItem>
          <el-input-number v-model="optionData.time" :min="0.1" />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>

    <el-form-item label="边框颜色">
      <FormSettingBox>
        <FormSettingItem name="边框1">
          <el-color-picker
            v-model="optionData.colors[0]"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => (optionData.colors[0] = val)"
          />
        </FormSettingItem>

        <FormSettingItem name="边框2">
          <el-color-picker
            v-model="optionData.colors[1]"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => (optionData.colors[1] = val)"
          />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>

    <el-form-item label="背景颜色">
      <FormSettingBox alone>
        <FormSettingItem>
          <el-color-picker
            v-model="optionData.backgroundColor"
            :show-alpha="true"
            @active-change="(val: string) => (optionData.backgroundColor = val)"
          />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>
  </el-collapse-item>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';

import FormSettingBox from '@/components/FormSettingBox/index.vue';
import FormSettingItem from '@/components/FormSettingBox/item.vue';
import { colorsPicker } from '@/config';
import { option } from './config';

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
