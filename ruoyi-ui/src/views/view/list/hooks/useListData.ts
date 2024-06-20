import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';

import { getViewList, removeView } from '@/api/view';
import type { PaginationType, Viewtype } from '../index.d';

export const useListData = (queryParams: object) => {
  const pagination: PaginationType = reactive({
    total: 0,
    pageNum: 1,
    pageSize: 20,
  });
  const listData = ref<Viewtype[]>([]);
  let listLoading = ref(false);

  const searchParams = computed(() => {
    return {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...queryParams,
    };
  });

  const getListData = async () => {
    try {
      listLoading.value = true;
      const res = await getViewList(searchParams.value);
      listData.value = res.rows || [];
      listData.value = listData.value.map(o => {
        return {
          ...o,
          pageUrl: o.pageUrl,
        };
      });

      pagination.total = res.total;
    } finally {
      listLoading.value = false;
    }
  };
  const resetListData = () => {
    pagination.pageNum = 1;
    getListData();
  };

  // 删除
  const deleteHandle = async (cardData: Viewtype) => {
    try {
      await ElMessageBox.confirm('是否删除该数据？');

      const res = await removeView(cardData.screenId);
      ElMessage.success(res.msg);
      getListData();
    } catch (e) {
      console.log(e);
    }
  };

  onMounted(() => {
    getListData();
  });

  return {
    pagination,
    listData,
    listLoading,
    getListData,
    resetListData,
    deleteHandle,
  };
};
