import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';

import { ChartEditStoreType } from '@/store/modules/chartEditStore/chartEditStore.d';
import { componentInstall } from '@/utils';
import { fetchChartComponent } from '@/packages/index';
import {
  CreateComponentType,
  CreateComponentGroupType,
} from '@/packages/index.d';
import { getViewDetail } from '@/api/view';
import { JSONParse } from '@/utils';
import { setPageTitle } from '@/utils/dynamicTitle';

export const initView = async (chartEditStore: ChartEditStoreType) => {
  const route = useRoute();
  const { id } = route.params;
  const screnId = typeof id === 'string' ? id : id[0];

  if (!screnId) {
    return;
  }

  const res = await getViewDetail(screnId);
  const viewData = JSONParse(res.data.pageData);
  if (viewData) {
    const { editCanvasConfig, requestGlobalConfig, componentList } = viewData;
    chartEditStore.editCanvasConfig = editCanvasConfig;
    chartEditStore.requestGlobalConfig = requestGlobalConfig;
    chartEditStore.componentList = componentList;
    console.log('页面数据：', viewData);
    setPageTitle(editCanvasConfig.projectName);

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

const intComponent = (target: CreateComponentType) => {
  // 注册组件
  componentInstall(
    target.chartConfig.chartKey,
    fetchChartComponent(target.chartConfig),
  );
};
