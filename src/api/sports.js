import { request } from '@/utils/request';

// 体育
export async function sports(params) {
  return request('/sports', {
    params,
    method: 'get',
  });
}

// 获取指定赛事直播数据
export async function getSportsLiveDetail(params) {
  return request('/sport_live_detail', {
    params,
    method: 'get',
  });
}

// 指定赛事赔率
export async function getSportsLiveOdds(params) {
  return request('/sport_bet', {
    params,
    method: 'get',
  });
}

// 获取体育赛事列表
export async function getSportsLiveList(params) {
  return request('/sport_live_list', {
    params,
    method: 'get',
  });
}

// 获取体育赛事列表
export async function getSportsLiveListV2(params) {
  return request('/sport_live_listv2', {
    params,
    method: 'get',
  });
}
