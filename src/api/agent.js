import { request } from '@/utils/request';

const baseUrl = import.meta.env.VITE_APP_AGENT_API_URL;

// 代理注册接口
export function register(data) {
  return request({
    method: 'post',
    url: `${baseUrl}register`,
    data,
  });
}

// 代理推荐码和审核设置
export function auditsetting(params) {
  return request({
    method: 'get',
    url: `${baseUrl}audit_setting`,
    params,
  });
}

// 优秀代理列表(目前在user环境)
export function excellentagent() {
  return request({
    url: `/excellentagent`,
    method: 'get',
  });
}

// 代理存取款折线图
export function agentdwtrend(params) {
  return request({
    url: `${baseUrl}agentdwtrend`,
    method: 'get',
    params,
  });
}

// 代理会员变化折线图
export function agentmemberstrend(params) {
  return request({
    url: `${baseUrl}agentmemberstrend`,
    method: 'get',
    params,
  });
}

// 代理总览饼图
export function agentbetstat(params) {
  return request({
    url: `${baseUrl}agentbetstat`,
    method: 'get',
    params,
  });
}

// 遗漏申请:推广设备
export function devtypelist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}dev_type_list`,
    params,
  });
}

// 遗漏申请:提出申请
export function askomit(data) {
  return request({
    method: 'post',
    url: `${baseUrl}ask_omit`,
    data,
  });
}

// 调整佣金比例
export function update_commission(data) {
  return request({
    method: 'post',
    url: `${baseUrl}update_commission`,
    data,
  });
}

// 代理下级转账
export function membertrans(data) {
  return request({
    method: 'post',
    url: `${baseUrl}/membertrans`,
    data,
  });
}

// 代理下级转账获取验证码
export function membertranssmscode(data) {
  return request({
    method: 'post',
    url: `${baseUrl}/membertranssmscode`,
    data,
  });
}

// 佣金转钱包余额
export function commissiontrans(data) {
  return request({
    method: 'post',
    url: `${baseUrl}/commissiontrans`,
    data,
  });
}

// 佣金转钱包余额
export function agentuserbetrank(params) {
  return request({
    method: 'get',
    url: `${baseUrl}/agentuserbetrank`,
    params,
  });
}

// 代理提现接口
export function withdraw(data) {
  return request({
    url: `${baseUrl}withdraw`,
    method: 'post',
    data,
  });
}

// 新增绑定银行卡接口
export function addbankcard(data) {
  return request({
    url: `${baseUrl}addbankcard`,
    method: 'post',
    data,
  });
}

// 代理所有银行列表
export function allbanklist(params) {
  return request({
    url: `${baseUrl}allbanklist`,
    method: 'get',
    params,
  });
}

// 代理:发送忘记密码:验证码
export function forgetpasssmscode(data) {
  return request({
    method: 'post',
    url: `${baseUrl}forgetpasssmscode`,
    data,
  });
}
// 代理:发送忘记密码:验证
export function forgetpasscode(data) {
  return request({
    method: 'post',
    url: `${baseUrl}forgetpasscode`,
    data,
  });
}

// 代理:重置密码
export function resetpass(data) {
  return request({
    method: 'post',
    url: `${baseUrl}resetpass`,
    data,
  });
}
// 更新代理资料接口
export function updatedetail(data) {
  return request({
    method: 'post',
    url: `${baseUrl}updatedetail`,
    data,
  });
}

// 代理绑定手机号获取手机验证码
export function bindsmscode(data) {
  return request({
    url: `${baseUrl}bindsmscode`,
    method: 'post',
    data,
  });
}

// 修改代理绑定手机号
export function bindmobile(data) {
  return request({
    url: `${baseUrl}bindmobile`,
    method: 'post',
    data,
  });
}

// 代理修改密码接口
export function setpass(data) {
  return request({
    url: `${baseUrl}setpass`,
    method: 'post',
    data,
  });
}

// 代理修改资金密码接口
export function setpaypass(data) {
  return request({
    url: `${baseUrl}setpaypass`,
    method: 'post',
    data,
  });
}

// 遗漏申请:审核状态列表
export function auditstatuslist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}audit_status_list`,
    params,
  });
}

// 遗漏申请列表
export function omitlist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}omit_list`,
    params,
  });
}

// 遗漏申请:添加会员
export function omitadduser(data) {
  return request({
    method: 'post',
    url: `${baseUrl}omit_add_user`,
    data,
  });
}

//  推广素材
export function promotionsource(params) {
  return request({
    method: 'get',
    url: `${baseUrl}promotion_source`,
    params,
  });
}

// 推广素材尺寸列表
export function promotionsourcesizelist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}promotion_source_size_list`,
    params,
  });
}

// 推广素材类型列表
export function promotionsourcetypelist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}promotion_source_type_list`,
    params,
  });
}

// 所有银行列表接口
export async function banklist(params) {
  return request({
    url: `${baseUrl}banklist`,
    method: 'get',
    params,
  });
}

// 推广链接:下级代理佣金比例
export async function setchildrate(data) {
  return request({
    method: 'post',
    url: `${baseUrl}setchildrate`,
    data,
  });
}

// 会员存款方式列表接口
export async function paytype(params) {
  return request({
    url: `${baseUrl}pay_type`,
    method: 'get',
    params,
  });
}

// 佣金结算状态
export async function agentcommissionstatus(params) {
  return request({
    url: `${baseUrl}agentcommissionstatus`,
    method: 'get',
    params,
  });
}

// 所有佣金领取状态接口
export async function allcommissionstatus(params) {
  return request({
    url: `${baseUrl}allcommissionstatus`,
    params,
  });
}

// 佣金记录
export async function agentcommissionlog(params) {
  return request({
    url: `${baseUrl}agentcommissionlog`,
    method: 'get',
    params,
  });
}

// 账变记录
export async function agentaccountchangelog(params) {
  return request({
    url: `${baseUrl}agentaccountchangelog`,
    method: 'get',
    params,
  });
}

// 帐变类型
export async function agentaccountchangetype(params) {
  return request({
    url: `${baseUrl}agentaccountchangetype`,
    method: 'get',
    params,
  });
}

// 代理代充
export async function agentdeposite(data) {
  return request({
    method: 'post',
    url: `${baseUrl}agentdeposite`,
    data,
  });
}

// 添加代理
export async function addagent(data) {
  return request({
    url: `${baseUrl}addagent`,
    method: 'post',
    data,
  });
}

// 添加下级
export async function addmember(data) {
  return request({
    url: `${baseUrl}addmember`,
    method: 'post',
    data,
  });
}

// //  代理列表
export async function agentlist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}agentlist_v2`,
    params,
  });
}

// 会员等级列表
export async function memberlevellist(params) {
  return request({
    url: `${baseUrl}memberlevellist`,
    method: 'get',
    params,
  });
}

// 会员列表
// username 否 string 会员用户名
// start_date 否 string 注册开始日期
// end_date 否 string 注册结束日期
export async function memberlist(params) {
  return request({
    url: `${baseUrl}memberlist`,
    method: 'get',
    params,
  });
}

// 代理报表接口
export async function agentsheet(params) {
  return request({
    url: `${baseUrl}agentsheet`,
    method: 'get',
    params,
  });
}

// 代理数据汇总
export async function agentstatinfo(params) {
  return request({
    url: `${baseUrl}agentstatinfo`,
    method: 'get',
    params,
  });
}

export async function relationdata(params) {
  return request({
    method: 'get',
    url: `${baseUrl}relation_data`,
    params,
  });
}

export async function login(data) {
  return request({
    method: 'post',
    url: `${baseUrl}login`,
    data,
  });
}

// // 代理在线状态
export async function agentonlinecheck(data) {
  return request({
    url: `${baseUrl}agent_online_check`,
    method: 'post',
    data,
  });
}

// 代理默认配置
export async function agentsettingdetail(params) {
  return request({
    url: `${baseUrl}agent_settingdetail`,
    method: 'get',
    params,
  });
}

// 代理详细资料接口
export async function userinfo(params) {
  return request({
    url: `${baseUrl}/userinfo`,
    method: 'get',
    params,
  });
}

// 代理详细资料接口
export async function subrechargerate(params) {
  return request({
    url: `${baseUrl}/sub_recharge_rate`,
    method: 'get',
    params,
  });
}

// 代理详细资料接口
export async function commissionsummary(params) {
  return request({
    url: `${baseUrl}/commission_summary`,
    method: 'get',
    params,
  });
}

// 货币列表菜单
export async function currencylist(params) {
  return request({
    url: `${baseUrl}/currencylist`,
    method: 'get',
    params,
  });
}
