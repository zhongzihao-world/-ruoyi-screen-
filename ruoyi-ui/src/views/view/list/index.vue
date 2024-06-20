<template>
  <div class="app-container">
    <el-form
      v-show="showQuery"
      :model="queryForm"
      ref="queryFormRef"
      :inline="true"
    >
      <el-form-item label="大屏名称" prop="screenTitle">
        <el-input
          v-model="queryForm.screenTitle"
          placeholder="请输大屏名称"
          clearable
          style="width: 200px"
          @keyup.enter="resetListData"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="resetListData">
          搜索
        </el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="addHandle">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button-group>
          <template v-for="item in showTypeList" :key="item.value">
            <el-tooltip placement="top" :content="item.label">
              <el-button
                style="font-size: 20px"
                :icon="item.icon"
                :type="showType === item.value ? 'primary' : ''"
                @click="changeShowType(item.value)"
              />
            </el-tooltip>
          </template>
        </el-button-group>
      </el-col>

      <RightToolbar v-model:showSearch="showQuery" @queryTable="getListData" />
    </el-row>

    <div class="view-box" v-show="showType === 'card'">
      <ViewItemCard
        v-loading="listLoading"
        v-for="(item, index) in listData"
        :key="item.screenId"
        :index="index"
        :cardData="item"
        :imgList="imgList"
        @edit="editHandle"
        @preview="previewHandle"
        @fullPreview="fullPreviewHandle"
        @delete="deleteHandle($event)"
      />
    </div>

    <el-table
      v-show="showType === 'list'"
      :data="listData"
      row-key="screenId"
      v-loading="listLoading"
    >
      <el-table-column prop="screenId" label="编号" width="100" />
      <el-table-column prop="screenTitle" label="名称" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column prop="updateTime" label="更新时间" width="180">
        <template #default="scope">
          {{ scope.row.updateTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" label="更新人" />

      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button type="text" icon="View" @click.="previewHandle(scope.row)">
            预览
          </el-button>
          <el-button
            v-if="'' + scope.row.createBy === '' + userInfo.userId"
            type="text"
            icon="Edit"
            @click="editHandle(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            type="text"
            icon="Delete"
            @click="deleteHandle(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-model:page="pagination.pageNum"
      v-model:limit="pagination.pageSize"
      :pageSizes="[20, 50, 100, 200]"
      :total="pagination.total"
      @pagination="getListData"
    />
  </div>

  <PreviewModal
    v-if="modalData"
    :modalShow="modalShow"
    :cardData="modalData"
    @edit="editHandle"
    @close="closeModal"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { FormInstance } from 'element-plus';

import { PageEnum } from '@/enums/pageEnum';
import useUserStore from '@/store/modules/user';
import PreviewModal from './PreviewModal/index.vue';
import ViewItemCard from './ViewItemCard/index.vue';
import { useModalDataInit } from './hooks/useModal';
import { useListData } from './hooks/useListData';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const showQuery = ref(true);
const queryFormRef = ref<FormInstance>();
const queryForm = reactive({
  screenTitle: '',
});
const resetQuery = () => {
  resetListData();
  queryFormRef.value?.resetFields();
};

const {
  pagination,
  listData,
  listLoading,
  getListData,
  resetListData,
  deleteHandle,
} = useListData(queryForm);

const {
  modalData,
  modalShow,
  editHandle,
  previewHandle,
  fullPreviewHandle,
  closeModal,
} = useModalDataInit();

const showType = ref('card');
const showTypeList = [
  {
    label: '列表',
    value: 'list',
    icon: 'Grid',
  },
  {
    label: '卡片',
    value: 'card',
    icon: 'Histogram',
  },
];
const changeShowType = (val: string) => (showType.value = val);

const imgList = computed(() => {
  return listData.value.map(o => o.pageUrl);
});

const addHandle = () => {
  window.open(PageEnum.VIEW_EDIT);
};
</script>

<style lang="scss" scoped>
.view-box {
  display: grid;
  grid-gap: 20px;
}

@media (max-width: 1920px) {
  .view-box {
    grid-template-columns: repeat(4, minmax(0px, 1fr));
  }
}

@media (max-width: 1260px) {
  .view-box {
    grid-template-columns: repeat(3, minmax(0px, 1fr));
  }
}

@media (max-width: 768px) {
  .view-box {
    grid-template-columns: repeat(1, minmax(0px, 1fr));
  }
}
</style>
