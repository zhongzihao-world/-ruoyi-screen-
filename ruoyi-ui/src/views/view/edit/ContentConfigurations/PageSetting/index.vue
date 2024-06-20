<template>
  <div class="page-setting">
    <el-form label-width="auto" label-position="left">
      <el-form-item label="大屏尺寸">
        <FormSettingBox>
          <FormSettingItem name="宽度">
            <el-input-number
              v-model="canvasConfig.width"
              :min="720"
              :disabled="editCanvas.lockScale"
              @change="changeSizeHandle"
            />
          </FormSettingItem>

          <FormSettingItem name="高度">
            <el-input-number
              v-model="canvasConfig.height"
              :min="405"
              :disabled="editCanvas.lockScale"
              @change="changeSizeHandle"
            />
          </FormSettingItem>
        </FormSettingBox>
      </el-form-item>
      <el-form-item label="大屏适配">
        <el-radio-group v-model="canvasConfig.previewScaleType">
          <el-tooltip
            v-for="item in previewTypeList"
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

      <el-form-item label="背景适配">
        <el-radio-group v-model="adapterType" @change="adapterTypeChange">
          <el-radio-button :label="0">颜色</el-radio-button>
          <el-radio-button :label="1">图片</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="adapterType === 0" label="背景颜色">
        <el-color-picker
          v-model="canvasConfig.background"
          style="width: 100%"
          :show-alpha="true"
          :predefine="bgColorsPicker"
          @active-change="backgroundColorChange"
        />
      </el-form-item>
      <el-form-item v-if="adapterType === 1" label="背景图片">
        <div class="background-box">
          <el-image fit="fill" :src="canvasConfig.backgroundImage" />
        </div>

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
    </el-form>

    <!-- 主题选择和全局配置 -->
    <el-divider>全局主题</el-divider>
    <ChartThemeColor />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { UploadRequestOptions } from 'element-plus';

import FormSettingBox from '@/components/FormSettingBox/index.vue';
import FormSettingItem from '@/components/FormSettingBox/item.vue';
import { bgColorsPicker } from '@/config';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { EditCanvasConfigEnum } from '@/store/modules/chartEditStore/chartEditStore.d';
import useSettingsStore from '@/store/modules/settings';
import { loadAsyncComponent } from '@/utils';
import { customUpload } from '@/utils/file';
import { PreviewScaleEnum } from '@/enums/styleEnum';

const ChartThemeColor = loadAsyncComponent(
  () => import('./ChartThemeColor/index.vue'),
);

const chartEditStore = useChartEditStore();
const canvasConfig = chartEditStore.getEditCanvasConfig;
const editCanvas = chartEditStore.getEditCanvas;

const settingsStore = useSettingsStore();
// 颜色
const themeColor = computed(() => {
  return settingsStore.theme;
});

const previewTypeList = [
  {
    value: PreviewScaleEnum.FIT,
    label: '自适应',
    desc: '自适应比例展示，页面会有留白',
  },
  {
    value: PreviewScaleEnum.SCROLL_Y,
    label: '滚动',
    desc: 'X轴铺满，Y轴滚动',
  },
  // {
  //   value: PreviewScaleEnum.SCROLL_X,
  //   label: 'X轴',
  //   desc: 'Y轴铺满，X轴滚动',
  // },
  {
    value: PreviewScaleEnum.FULL,
    label: '铺满',
    desc: '强行拉伸画面，填充所有视图',
  },
];

// 修改尺寸
const changeSizeHandle = () => {
  chartEditStore.computedScale();
};

// 适配方式
const adapterType = ref(0);
watch(
  () => canvasConfig.selectColor,
  newValue => {
    adapterType.value = newValue ? 0 : 1;
  },
  {
    immediate: true,
  },
);
const adapterTypeChange = (value: number) => {
  canvasConfig.selectColor = value == 0;
};
// 修改背景颜色
const backgroundColorChange = (color: string) => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND, color);
};
// 自定义上传操作
const limit = 1;
const customRequest = async (options: UploadRequestOptions) => {
  try {
    const url = await customUpload(options, limit);
    if (!url) return;

    chartEditStore.setEditCanvasConfig(
      EditCanvasConfigEnum.BACKGROUND_IMAGE,
      url,
    );
    chartEditStore.setEditCanvasConfig(
      EditCanvasConfigEnum.SELECT_COLOR,
      false,
    );
  } catch (e) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
.page-setting {
  padding: 20px 10px;

  .el-form {
    .background-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 112.5px;
      border: 1px dashed v-bind(themeColor);
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  :deep(.el-divider__text) {
    font-weight: bold;
  }
}
</style>
