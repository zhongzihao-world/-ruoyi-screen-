import { ElMessage } from 'element-plus';

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { canvasToImg, downloadFile } from '@/utils/file';
import { JSONStringify } from '@/utils';

const chartEditStore = useChartEditStore();

// 导出图片
export const exportImageHandle = () => {
  // 取消选中
  chartEditStore.setTargetSelectChart(undefined);

  const wrap = document.querySelector('.canvas-wrap') as HTMLElement;
  const range = document.querySelector('.canvas-range') as HTMLElement;

  if (!wrap || !range) {
    ElMessage.error('导出异常！');
    return;
  }

  // 记录画布位置信息
  const scrollTop = wrap.scrollTop;
  const scrollLeft = wrap.scrollLeft;
  const scale = chartEditStore.getEditCanvas.scale;

  // 100% 截图
  chartEditStore.setScale(1, true);

  setTimeout(() => {
    // 导出图片
    canvasToImg(range);

    // 还原画布位置信息
    chartEditStore.setScale(scale, true);
    wrap.scrollTop = scrollTop;
    wrap.scrollLeft = scrollLeft;
  }, 200);
};

// 导出 JSON
export const exportJSONHandle = () => {
  downloadFile(
    JSONStringify(chartEditStore.getStorageInfo || []),
    undefined,
    'json',
  );
};
