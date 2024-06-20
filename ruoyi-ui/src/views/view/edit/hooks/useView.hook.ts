import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import { PageEnum } from '@/enums/pageEnum';
import {
  JSONStringify,
  JSONParse,
  componentInstall,
  toHTMLCanvasElement,
} from '@/utils';
import { fetchChartComponent, fetchConfigComponent } from '@/packages';
import { addView, getViewDetail, updateView, uploadView } from '@/api/view';

export const useView = () => {
  const route = useRoute();
  const router = useRouter();
  const chartEditStore = useChartEditStore();

  // ID
  const screenId = ref('');
  watch(
    () => route.params,
    ({ id }) => {
      screenId.value = typeof id === 'string' ? id : id[0];
    },
    { immediate: true },
  );

  const initView = async () => {
    const route = useRoute();
    const { id } = route.params;
    const screnId = typeof id === 'string' ? id : id[0];

    if (!screnId) {
      return;
    }
    const res = await getViewDetail(screnId);
    const viewData = JSONParse(res.data.pageData);
    console.log('页面数据：', viewData);

    // 注册组件
    const intComponent = (target: CreateComponentType) => {
      componentInstall(
        target.chartConfig.chartKey,
        fetchChartComponent(target.chartConfig),
      );
      componentInstall(
        target.chartConfig.conKey,
        fetchConfigComponent(target.chartConfig),
      );
    };

    if (viewData) {
      const { editCanvasConfig, requestGlobalConfig, componentList } = viewData;
      chartEditStore.editCanvasConfig = editCanvasConfig;
      chartEditStore.requestGlobalConfig = requestGlobalConfig;
      chartEditStore.componentList = componentList;

      // 注册组件
      componentList.forEach(
        async (e: CreateComponentType | CreateComponentGroupType) => {
          if (e.isGroup) {
            (e as CreateComponentGroupType).groupList.forEach(groupItem => {
              intComponent(groupItem);
            });
          } else {
            intComponent(e as CreateComponentType);
          }
        },
      );
    } else {
      ElMessage.error('数据初始化异常，请重新刷新页面');
    }
  };

  const savePagecover = async () => {
    try {
      if (!screenId.value) {
        return ElMessage.error('请先保存数据！');
      }

      // 取消选中
      chartEditStore.setTargetSelectChart(undefined);

      const wrap = document.querySelector('.canvas-wrap') as HTMLElement;
      const range = document.querySelector('.canvas-range') as HTMLElement;

      // 记录画布位置信息
      const scrollTop = wrap.scrollTop;
      const scrollLeft = wrap.scrollLeft;
      const scale = chartEditStore.getEditCanvas.scale;

      // 100% 截图
      chartEditStore.setScale(1, true);

      setTimeout(async () => {
        const canvas = await toHTMLCanvasElement(range);
        canvas.toBlob(async blobObj => {
          const file = new File([blobObj as Blob], 'screen.png', {
            type: 'image/png',
          });
          const formData = new FormData();
          formData.append('viewfile', file);
          const { fileName } = await uploadView(formData);

          const saveData = {
            screenId: screenId.value,
            pageUrl: fileName,
          };
          await updateView(saveData);

          ElMessage.success('更新封面成功');
        });

        // 还原画布位置信息
        chartEditStore.setScale(scale, true);
        wrap.scrollTop = scrollTop;
        wrap.scrollLeft = scrollLeft;
      }, 200);
    } catch (e) {
      console.log(e);
      ElMessage.error('保存数据异常');
    }
  };

  const saveView = async () => {
    try {
      const saveData = {
        screenId: screenId.value,
        screenName: chartEditStore.editCanvasConfig.projectName,
        screenTitle: chartEditStore.editCanvasConfig.projectName,
        status: 0,
        isrelease: 0,
        pageData: JSONStringify({
          ...chartEditStore.getStorageInfo,
        }),
      };
      console.log('保存数据：', saveData);
      // 编辑
      if (screenId.value) {
        await updateView(saveData);
      }
      // 新建
      else {
        const res = await addView(saveData);
        const screenId = res.data;
        router.push({
          path: PageEnum.VIEW_EDIT + '/' + screenId,
        });
      }

      ElMessage.success('保存成功');
    } catch (e) {
      console.log('保存数据异常', e);
    }
  };

  const goPreviewPage = () => {
    window.open(PageEnum.VIEW_PREVIEW + '/' + screenId.value);
  };

  return {
    screenId,

    initView,
    savePagecover,
    saveView,

    goPreviewPage,
  };
};
