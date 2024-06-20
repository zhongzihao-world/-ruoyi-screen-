<template>
  <el-form-item label="">
    <el-image
      v-if="optionData.dataset"
      :fit="optionData.fit"
      :src="optionData.dataset"
    />

    <el-upload
      :accept="['.jpg', 'jpeg', '.png']"
      :show-file-list="false"
      :http-request="customRequest"
    >
      <el-button type="primary" style="margin-top: 8px">点击上传</el-button>

      <template #tip>
        <div class="el-upload__tip">
          支持jpg、png格式，大小不超过 {{ limit }} mb
        </div>
      </template>
    </el-upload>
  </el-form-item>

  <el-form-item label="填充方式">
    <el-radio-group v-model="optionData.fit">
      <el-tooltip
        v-for="item in FitTypeEnum"
        :key="item.value"
        :content="item.desc"
        placement="top"
      >
        <el-radio-button :label="item.value">
          {{ item.label }}
        </el-radio-button>
      </el-tooltip>
    </el-radio-group>
  </el-form-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { UploadRequestOptions } from 'element-plus';

import FormSettingBox from '@/components/FormSettingBox/index.vue';
import FormSettingItem from '@/components/FormSettingBox/item.vue';
import { customUpload } from '@/utils/file';
import { FitTypeEnum } from '@/enums/styleEnum';
import { option } from './config';

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});

// 自定义上传操作
const limit = 1;
const customRequest = async (options: UploadRequestOptions) => {
  try {
    const url = await customUpload(options, limit);
    if (!url) return;

    props.optionData.dataset = url;
  } catch (e) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
.el-image {
  width: 270px;
  height: 151.875px;
}
</style>
