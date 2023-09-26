import { request } from '@/utils/request';

// 所有游戏分类接口
export async function getlotterytime(params) {
  return request('/getlotterytime', {
    params,
    method: 'get',
  });
}
