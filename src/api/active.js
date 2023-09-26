import { request } from '@/utils/request';

// 所有游戏分类接口
export async function allbenefit(params) {
  return request('/allbenefit', {
    params,
    method: 'get',
  });
}

// 活动详情
export async function activitydetail(params) {
  return request('/activitydetail', {
    params,
    method: 'get',
  });
}

// 活动详情
export async function getactivityaward(params) {
  return request('/getactivityaward', {
    params,
    method: 'get',
  });
}

// 商户游戏列表接口
export async function activitylist(params) {
  return request('/activitylist', {
    params,
    method: 'get',
  });
}
