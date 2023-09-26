import { request } from '@/utils/request';
import { encodeHTML } from '@/utils/escapeHtml';
const VITE_APP_MERCHANT_NO = 10004 //import.meta.env.VITE_APP_MERCHANT_NO
const agentBaseUrl = import.meta.env.VITE_APP_AGENT_API_URL;

// 游戏平台
export async function allplatform(params) {
  return request('/allplatform', {
    params,
    method: 'get',
  });
}

// 获取所有游戏分类的游戏平台
export async function platformgameidsv2(params) {
  return request('/platformgameidsv2', {
    params,
    method: 'get',
  });
}
// 会员等级
export async function memberlevellist(params) {
  return request('/memberlevellist', {
    params,
    method: 'get',
  });
}

// 银行列表
export async function allbanklist(params) {
  return request('/allbanklist', {
    params,
    method: 'get',
  });
}

// 获取手机区号列表
export async function phoneareav3(params) {
  return request('/phoneareav3', {
    params,
    method: 'get',
  });
}

// 获取站点配置信息
export async function siteinfo(params) {
  const amendFields = ['pc_stat', 'h5_stat', 'pc_kf_js', 'h5_kf_js'];
  return request('/siteinfo', {
    params,
    method: 'get',
  }).then((res) => {
    // for (const field in res) {
    //   if (amendFields.includes(field)) {
    //     res[field] = encodeHTML(res[field]);
    //   }
    // }
    amendFields.forEach((field) => {
      if (res[field]) res[field] = encodeHTML(res[field]);
    });
    return res;
  });
}

// 取款状态
export async function allwithdrawstatus(params) {
  return request('/allwithdrawstatus', {
    method: 'get',
    params,
  });
}

// 会员等级列表
export async function agentmemberlevellist(params) {
  return request({
    url: `${agentBaseUrl}memberlevellist`,
    method: 'get',
    params,
  });
}

// 盈利榜
export async function newtoplist(params) {
  return request('/newtoplist', {
    method: 'get',
    params,
  });
}

// 遗漏申请:审核状态列表
export function auditstatuslist(params) {
  return request({
    method: 'get',
    url: `${agentBaseUrl}audit_status_list`,
    params,
  });
}

// 遗漏申请:推广设备
export function devtypelist(params) {
  return request({
    method: 'get',
    url: `${agentBaseUrl}dev_type_list`,
    params,
  });
}

// 代理所有银行列表
export function agentallbanklist(params) {
  return request({
    url: `${agentBaseUrl}allbanklist`,
    method: 'get',
    params,
  });
}

// 地区列表
export async function regionlist(params) {
  return request('/regionlist', {
    params,
    method: 'get',
  });
}

// 常见问题
export async function aplist(params) {
  return request('/aqlist', {
    method: 'get',
    params,
  });
}

// 游戏手册
export async function gamemanual(params) {
  return request('/gamemanual', {
    params,
    method: 'get',
  });
}
