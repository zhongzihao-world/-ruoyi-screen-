import html2canvas from 'html2canvas';
import { ElMessage, type UploadRequestOptions } from 'element-plus';

import { uploadView } from '@/api/view';

/**
 * 获取上传的文件数据
 * @param { File } file 文件对象
 */
export const readFile = (file: File) => {
  return new Promise((resolve: Function) => {
    try {
      const reader = new FileReader();
      reader.onload = (evt: ProgressEvent<FileReader>) => {
        if (evt.target) {
          resolve(evt.target.result);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      ElMessage.error('文件读取失败！');
    }
  });
};

/**
 * 通过 a 标签下载数据
 * @param url
 * @param filename
 * @param fileSuffix
 */
export const downloadByA = (
  url: string,
  filename = new Date().getTime(),
  fileSuffix?: string,
) => {
  const ele = document.createElement('a');
  ele.download = `${filename}.${fileSuffix}`;
  ele.style.display = 'none';
  ele.href = url;
  document.body.appendChild(ele);
  ele.click();
  document.body.removeChild(ele);
};

/**
 * 下载数据
 * @param { string } content 数据内容
 * @param { ?string } filename 文件名称（默认随机字符）
 * @param { ?string } fileSuffix 文件名称（默认随机字符）
 */
export const downloadFile = (
  content: string,
  filename = new Date().getTime(),
  fileSuffix?: string,
) => {
  const blob = new Blob([content]);
  downloadByA(URL.createObjectURL(blob), filename, fileSuffix);
};

/**
 * file转url
 */
export const fileToUrl = (file: File): string => {
  const Url = URL || window.URL || window.webkitURL;
  const ImageUrl = Url.createObjectURL(file);
  return ImageUrl;
};

/**
 * 截取画面为图片并下载
 * @param html 需要截取的 DOM
 */
export const canvasToImg = (html: HTMLElement | null) => {
  if (!html) {
    return;
  }
  html2canvas(html, {
    backgroundColor: null,
    allowTaint: true,
    useCORS: true,
  }).then((canvas: HTMLCanvasElement) => {
    downloadByA(canvas.toDataURL(), undefined, 'png');
  });
};

/**
 * HTMLElement => HTMLCanvasElement
 * @param html 需要截取的 DOM
 */
export const toHTMLCanvasElement = async (
  html: HTMLElement,
): Promise<HTMLCanvasElement> => {
  return await html2canvas(html, {
    backgroundColor: null,
    allowTaint: true,
    useCORS: true,
  });
};

/**
 * 自定义上传
 * @param options
 * @param limit 大小限制，默认 1 MB
 * @returns
 */
export const customUpload = async (
  options: UploadRequestOptions,
  limit = 1,
) => {
  const { file } = options;
  if (file.size >= 1024 * 1024 * limit) {
    ElMessage.error(`图片大小超过限制，不能超过 ${limit} MB`);
    return;
  }

  let formData = new FormData();
  formData.append('viewfile', file);
  const res = await uploadView(formData);
  return res.fileName;
};
