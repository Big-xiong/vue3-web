import { request } from '@/utils/request';

// 获取token
export async function getToken(data) {
  return request('/token', {
    data,
    method: 'post',
  });
}

// 账号注册
export async function register(data) {
  return request('/register', {
    data,
    method: 'post',
  });
}

// 手机号注册
export async function mobileregister(data) {
  return request('/mobileregister', {
    data,
    method: 'post',
  });
}

// 账号注册
export async function quickregister(data) {
  return request('/quickregister', {
    data,
    method: 'post',
  });
}

// 账号登录
export async function login(data) {
  return request('/login', {
    data,
    method: 'post',
  });
}

// 获取用户详情
export async function member(data) {
  return request('/member', {
    data,
    method: 'get',
  });
}

// 会员平台钱包余额接口
export async function wallet(params) {
  return request('/wallet', {
    method: 'get',
    params,
  });
}

// 忘记密码
export function forgetPassword(data) {
  return request('/forgetpass', { method: 'post', data });
}
// 忘记密码邮箱验证码
export function forgetPassEmailCode(data) {
  return request('/forgetpassemailcode', { method: 'post', data });
}
// 忘记密码校验邮箱验证码
export function forgetPassEmailCodeCheck(data) {
  return request('/forgetpassemailcodecheck', { method: 'post', data });
}
// 忘记密码手机验证码
export function forgetPassSmsCode(data) {
  return request('/forgetpasssmscode', { method: 'post', data });
}
// 忘记密码校验手机验证码
export function forgetPassSmsCodeCheck(data) {
  return request('/forgetpasscode', { method: 'post', data });
}
// 忘记密码设置密码
export function forgetPassReset(data) {
  return request('/forgetpassreset', { method: 'post', data });
}
// 忘记密码密保问题
export function passQuestion(params) {
  return request('/passquestion', { method: 'get', params });
}
// 忘记密码密保问题校验
export function passQuestionCheck(data) {
  return request('/forgetsafequestion', { method: 'post', data });
}

// 手机登录
export async function mobileLogin(data) {
  return request('/mobilelogin', {
    data,
    method: 'post',
  });
}

export async function withdrawcheckemail() {
  return request('/withdraw_checkemail', {
    method: 'get',
  });
}

// 修改账号
export async function firstchange(data) {
  return request('/firstchange', {
    data,
    method: 'post',
  });
}
