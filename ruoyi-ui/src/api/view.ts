import service from '@/utils/request';

export function getViewList(query: object): any {
  return service.request({
    url: '/screen/list',
    method: 'get',
    params: query,
  });
}

export function addView(data: object): any {
  return service({
    url: '/screen',
    method: 'post',
    data,
  });
}
export function removeView(id: number): any {
  return service({
    url: '/screen/' + id,
    method: 'delete',
  });
}
export function getViewDetail(id: number | string): any {
  return service({
    url: '/screen/' + id,
    method: 'get',
  });
}
export function updateView(data: object): any {
  return service({
    url: '/screen',
    method: 'put',
    data,
  });
}

// 用户头像上传
export function uploadView(data: FormData): any {
  return service({
    url: '/common/upload',
    method: 'post',
    data,
  });
}
