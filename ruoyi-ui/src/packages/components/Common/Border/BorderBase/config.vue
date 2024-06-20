<template>
  <el-form-item label="边框标题">
    <el-input v-model="optionData.borderTitle" />
  </el-form-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import FormSettingBox from '@/components/FormSettingBox/index.vue';
import FormSettingItem from '@/components/FormSettingBox/item.vue';
import { option } from './config';

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
