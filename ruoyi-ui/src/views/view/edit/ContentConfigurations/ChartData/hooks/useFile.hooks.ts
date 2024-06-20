import { ref } from 'vue';
import { ElMessage } from 'element-plus';

import { readFile, downloadFile, JSONStringify, JSONParse } from '@/utils';

export const useFile = (targetData: any, fn: Function) => {
  const uploadFileListRef = ref();

  const customRequest = async (options: any) => {
    const { file } = options;
    try {
      if (file) {
        const fileData: any = await readFile(file);
        const { dimensions, source } = JSONParse(fileData);

        targetData.value.option.dataset = {
          dimensions,
          _dimensions: dimensions,
          source,
        };
        // 执行副作用
        fn();
      }
    } catch (error) {
      console.log(error);
      ElMessage.error('导入数据失败！');
    }
  };

  const download = () => {
    try {
      ElMessage.info('正在下载数据......');
      downloadFile(
        JSONStringify(targetData.value.option.dataset),
        undefined,
        'json',
      );
    } catch (error) {
      console.log(error);
      ElMessage.error('下载失败！');
    }
  };
  return {
    uploadFileListRef,
    customRequest,
    download,
  };
};
