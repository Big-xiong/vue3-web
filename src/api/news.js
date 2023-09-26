import { request } from '@/utils/request';

// 首页弹窗接口
export async function indexpop(params) {
  return request({
    url: '/indexpop',
    method: 'get',
    params,
  });
}
