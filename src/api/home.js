import { request } from '@/utils/request';

// banner
export async function indexbanner(params) {
  return request('/indexbanner', {
    params,
    method: 'get',
  });
}
// 盈利榜
export async function newtoplist(params) {
  return request('/newtoplist', {
    params,
    method: 'get',
  });
}

// 客户请求回电接口
export async function recall(data) {
  return request('/recall', {
    method: 'post',
    data,
  });
}

// 上传文件
export async function upload(params) {
  return request('/upload', {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8',
    },
    data: params,
  });
}

// 获取每日任务接口
export async function dailytasks() {
  return request('/dailytasks', {
    method: 'get',
  });
}

// 领取每日任务
export async function getreward(params) {
  return request('/getreward', {
    params,
    method: 'get',
  });
}
