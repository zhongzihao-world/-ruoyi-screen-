<template>
  <el-card v-if="cardData" shadow="always">
    <template #header>
      <div class="card-hd">
        <el-text class="card-tit" truncated size="large">
          {{ cardData.screenTitle }}
        </el-text>

        <div class="card-opt">
          <template v-for="item in btnList" :key="item.value">
            <el-tooltip placement="top" :content="item.label">
              <el-text :type="item.type">
                <el-icon :size="20">
                  <component
                    :is="item.icon"
                    @click="handleCommand(item.value)"
                  />
                </el-icon>
              </el-text>
            </el-tooltip>
          </template>
        </div>
      </div>
    </template>

    <div class="card-bd">
      <el-image
        lazy
        :src="cardData.pageUrl"
        :preview-src-list="imgList"
        :initial-index="index"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, PropType } from 'vue';

import type { Viewtype } from '../index.d';

const props = defineProps({
  index: Number,
  cardData: Object as PropType<Viewtype>,
  imgList: Array as PropType<string[]>,
});

const emit = defineEmits(['edit', 'preview', 'fullPreview', 'delete']);

const btnList = reactive([
  {
    label: '编辑',
    value: 'edit',
    icon: 'Edit',
    type: 'primary',
  },
  {
    label: '预览',
    value: 'preview',
    icon: 'View',
    type: 'primary',
  },
  {
    label: '全屏预览',
    value: 'fullPreview',
    icon: 'FullScreen',
    type: 'primary',
  },
  {
    label: '删除',
    value: 'delete',
    icon: 'Delete',
    type: 'danger',
  },
]);

const handleCommand = (key: string) => {
  switch (key) {
    case 'edit':
      handleEdit();
      break;
    case 'preview':
      handlePreview();
      break;
    case 'fullPreview':
      handleFullPreview();
      break;
    case 'delete':
      handleDelete();
      break;
  }
};

const handleEdit = () => {
  emit('edit', props.cardData);
};

const handlePreview = () => {
  emit('preview', props.cardData);
};

const handleFullPreview = () => {
  emit('fullPreview', props.cardData);
};

const handleDelete = () => {
  emit('delete', props.cardData);
};
</script>

<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 0 !important;
}

.card-tit {
  font-weight: bold;
}
.card-hd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .card-opt {
    display: flex;
    align-items: center;
    .el-icon {
      margin-left: 8px;
      cursor: pointer;
      font-size: 22px;
    }
  }
}

.card-bd {
  width: 100%;
  height: 200px;
  overflow: hidden;
  .el-image {
    width: 100%;
    height: 100%;
    :deep(img) {
      transition: 400ms;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
