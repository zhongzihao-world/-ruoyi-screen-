<template>
  <el-form-item label="">
    <Draggable
      item-key="id"
      v-model="optionData.dataset"
      ghostClass="ghostClass"
      class="list-bd"
      @change="moveEndHandle"
    >
      <template #item="{ element, index }">
        <div
          class="list-item"
          :class="{ active: index === activeIndex }"
          @click="activeIndex = index"
        >
          <div class="list-item-box">
            <div class="list-item-content">
              <el-image lazy :fit="optionData.fit" :src="element" />

              <el-text truncated>图片{{ index + 1 }}</el-text>
            </div>

            <div class="list-items-opt">
              <!-- <el-tooltip content="替换" placement="top">
                  <el-button
                    link
                    type="primary"
                    icon="Edit"
                  />
                </el-tooltip> -->

              <el-tooltip
                v-if="props.optionData.dataset.length > 1"
                content="删除"
                placement="top"
              >
                <el-button
                  link
                  type="danger"
                  icon="Delete"
                  @click="deleteHandle"
                />
              </el-tooltip>
            </div>
          </div>
        </div>
      </template>
    </Draggable>

    <el-upload
      ref="uploadRef"
      :accept="['.jpg', 'jpeg', '.png']"
      :show-file-list="false"
      :http-request="(opt: any) => customRequest(opt)"
      style="width: 100%"
    >
      <template #trigger>
        <el-button type="primary" icon="Plus">新增</el-button>
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

  <el-form-item label="轮播方向">
    <el-radio-group v-model="optionData.direction">
      <el-tooltip
        v-for="item in DirectionEnum"
        :key="item.value"
        :content="item.desc"
        :disabled="!item.desc"
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
import { PropType, ref, computed } from 'vue';
import type { UploadRequestOptions } from 'element-plus';
import Draggable from 'vuedraggable';

import FormSettingBox from '@/components/FormSettingBox/index.vue';
import FormSettingItem from '@/components/FormSettingBox/item.vue';
import { customUpload } from '@/utils/file';
import { FitTypeEnum, DirectionEnum } from '@/enums/styleEnum';
import useSettingsStore from '@/store/modules/settings';
import { option } from './config';

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});

const settingsStore = useSettingsStore();
// 颜色
const themeColor = computed(() => {
  return settingsStore.theme;
});

let activeIndex = ref(0);
const moveEndHandle = (val: any) => {
  const { newIndex } = val.moved;
  activeIndex.value = newIndex;
};

// 删除
const deleteHandle = (index: number) => {
  props.optionData.dataset.splice(index, 1);
};
// 自定义上传操作
const customRequest = async (options: UploadRequestOptions, index?: number) => {
  try {
    const url = await customUpload(options, 1);
    if (!url) return;

    props.optionData.dataset.push(url);
    activeIndex.value = -1;
  } catch (e) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
.list-bd {
  width: 100%;
  margin-bottom: 8px;
  z-index: 0;

  .list-item {
    position: relative;
    margin-bottom: 4px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px dashed v-bind(themeColor);

    &.active {
      border-style: solid;

      &::after {
        content: '';
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.2;
        background-color: v-bind(themeColor);
      }
    }

    .list-item-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      font-size: 14px;
      .list-item-content {
        display: flex;
        align-items: center;
        .el-image {
          width: 100px;
          height: 60px;
          border-radius: 8pxpx;
        }
        .el-text {
          margin-left: 5px;
        }
      }
      .list-items-opt {
        .el-button {
          margin: 0;
        }
        :deep(.el-icon) {
          font-size: 18px;
        }
      }
    }
  }
}
.ghostClass {
  opacity: 0.4;
}

:deep(.el-upload) {
  width: 100%;
  .el-button {
    width: 100%;
  }
}
</style>
