import { ref } from 'vue';

import { PageEnum } from '@/enums/pageEnum';
import type { Viewtype } from '../index.d';

export const useModalDataInit = () => {
  const modalShow = ref<boolean>(false);
  const modalData = ref<Viewtype | null>(null);

  // 编辑
  const editHandle = (cardData: Viewtype) => {
    if (!cardData) return;
    window.open(PageEnum.VIEW_EDIT + '/' + cardData.screenId);
  };

  // 预览
  const previewHandle = (cardData: Viewtype) => {
    if (!cardData) return;
    modalShow.value = true;
    modalData.value = cardData;
  };

  // 全屏预览
  const fullPreviewHandle = (cardData: Viewtype) => {
    if (!cardData) return;
    window.open(PageEnum.VIEW_PREVIEW + '/' + cardData.screenId);
  };

  // 关闭
  const closeModal = () => {
    modalShow.value = false;
    modalData.value = null;
  };

  return {
    modalData,
    modalShow,
    editHandle,
    previewHandle,
    fullPreviewHandle,
    closeModal,
  };
};
