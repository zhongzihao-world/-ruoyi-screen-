<template>
  <el-form-item label="">
    <video
      ref="vVideoRef"
      preload="auto"
      muted
      autoplay
      loop
      controls
      :src="optionData.dataset"
    ></video>

    <el-upload
      :accept="['.mp4']"
      :show-file-list="false"
      :http-request="customRequest"
    >
      <el-button type="primary" style="margin-top: 8px">点击上传</el-button>

      <template #tip>
        <div class="el-upload__tip">支持mp4格式，大小不超过 {{ limit }} mb</div>
      </template>
    </el-upload>
  </el-form-item>

  <el-form-item label="视频属性">
    <el-checkbox v-model="optionData.loop">循环播放</el-checkbox>

    <el-checkbox v-model="optionData.muted">静音</el-checkbox>
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
const limit = 10;
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
video {
  width: 270px;
  height: 151.875px;
  object-fit: v-bind('optionData.fit');
}
</style>
