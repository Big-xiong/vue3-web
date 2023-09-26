import { request } from '@/utils/request';
// 红包雨活动
// 获取红包雨详情
export async function getRedRainInfo() {
  return request('/getredMoneyRain', {
    method: 'get',
  });
}

// 领取红包雨活动奖金
export async function claimRedRain() {
  return request('/takeRedRain', {
    method: 'get',
  });
}

// 领取红包雨活动奖金列表
export async function getRedRainWinList(params) {
  return request('/get_redMoneyRainWinList', {
    method: 'get',
    params,
  });
}

// 记录用户参与场次
export async function redMoneyRound(params) {
  return request('/red_money_round', {
    method: 'get',
    params,
  });
}

// 专题活动详情接口
export async function specialdetail(params) {
  return request('/specialdetail', {
    method: 'get',
    params,
  });
}
// 参与借贷宝活动
export async function joinborrow(data) {
  return request('/joinborrow', {
    method: 'post',
    data,
  });
}
// 借贷宝破产申请
export async function brokeapply(data) {
  return request('/brokeapply', {
    method: 'post',
    data,
  });
}
// 借款申请记录
export async function borrowjoinrecord(params) {
  return request('/borrowjoinrecord', {
    method: 'get',
    params,
  });
}
// 
export async function spreadinfo(params) {
  return request('/spreadinfo', {
    method: 'get',
    params,
  });
}
// 
export async function spreadrecord(params) {
  return request('/spreadrecord', {
    method: 'get',
    params,
  });
}
// 
export async function getspreadmoney(data) {
  return request('/getspreadmoney', {
    method: 'post',
    data,
  });
}
// 存款六重礼领取记录接口
export async function sixinforecord(params) {
  return request('/sixinforecord', {
    method: 'get',
    params,
  });
}
// 存款六重礼信息接口
export async function sixinfo(params) {
  return request('/sixinfo', {
    method: 'get',
    params,
  });
}
// 领取新手六重礼
export async function getsixinfoReward(params) {
  return request('/getsixinfoReward', {
    method: 'get',
    params,
  });
}
// 鱼乐无限
export async function fishHappyUnlimited(params) {
  return request('/fishHappyUnlimited', {
    method: 'get',
    params,
  });
}
// 鱼乐无限
export async function fishHappyPlay(params) {
  return request('/fishHappyPlay', {
    method: 'get',
    params,
  });
}
// 新人累存
export async function newerTotalDeposit(params) {
  return request('/newerTotalDeposit', {
    method: 'get',
    params,
  });
}
// 新人累存
export async function newerRegSent(params) {
  return request('/newerRegSent', {
    method: 'get',
    params,
  });
}