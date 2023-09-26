/* eslint-disable indent */
import axios from 'axios';
// import LRU from 'lru-cache';
import { ElMessage, ElLoading } from 'element-plus';
import Cookies from 'js-cookie';
import { checkWhiteList, resetParams } from './requestHelp';
import { router, store } from '@/init';

// const cache = new LRU({
//   max: 1000,
//   maxAge: 1000 * 60 * 10,
// });

const instance = axios.create({
  baseURL: localStorage.getItem('TEST_HOST') || import.meta.env.VITE_APP_WEB_API_URL,
  method: 'post',
  timeout: import.meta.env.SSR ? 3000 : 15000,
  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // 默认的
});
// 取消请求
const CancelToken = axios.CancelToken;

const requestQueue = new Map();
const loadingQueue = new Set();

let fullScreenLoading = null;

// 请求拦截器配置
instance.interceptors.request.use(
  async (config) => {
    const query = {
      merchant_no: localStorage.getItem('TEST_MERCHANT') || Number(import.meta.env.VITE_APP_MERCHANT_NO),
    };
    const key = config.method === 'get' ? 'params' : 'data';
    const { noCancel, LOADING, ...params } = config[key] ?? {};
    if (!noCancel && !['/get_redMoneyRainWinList', '/sitenotice'].includes(config.url)) {
      if (requestQueue.has(config.url)) {
        requestQueue.get(config.url)('cancel');
        requestQueue.delete(config.url);
      } else {
        config.cancelToken = new CancelToken((cancel) => {
          requestQueue.set(config.url, cancel);
        });
      }
    } else {
      requestQueue.delete(config.url);
    }

    if (LOADING) {
      loadingQueue.add(config.url);
      fullScreenLoading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.7)',
      });
    }

    config[key] = {
      ...query,
      ...params,
      access_token: Cookies.get(
        (config.baseURL.includes('agentapi') || config.url.includes('agentapi')) ? 'agent_access_token' : 'access_token',
      ),
    };

    // @todo 测试使用 用完删除
    // _login(config);
    return config;
  },
  (error) => Promise.error(error),
);

let isLogout = 0;
let clearLoadingTimer = null;
// 响应拦截器配置
instance.interceptors.response.use(
  (response) => {
    loadingQueue.delete(response.config.url);

    if (clearLoadingTimer) clearTimeout(clearLoadingTimer);
    if (fullScreenLoading) {
      clearLoadingTimer = setTimeout(() => {
        if (!loadingQueue.size) {
          fullScreenLoading.close();
          fullScreenLoading = null;
        }
      }, 300);
    }

    let errorFlag = false;
    let clearFlag = false;
    const isAgent = response.config.baseURL.includes('agentapi') || response.config.url.includes('agentapi');
    switch (response.data.code) {
      case 0:
        break;
      case -5:
      case -6:
      case -9:
        errorFlag = true;
        break;
      case -990:
      case -998:
        router?.push({ path: '/' });
        clearFlag = true;
        errorFlag = true;
        isLogout += 1;
        break;
      case -999:
        clearFlag = true;
        errorFlag = true;
        isLogout += 1;
        router?.push({ path: isAgent ? '/affiliate?isLogin' : '/' });
        break;
      default:
        errorFlag = true;
    }
    if (clearFlag && isLogout <= 1) {
      store.dispatch(`${isAgent ? 'agent' : 'user'}/logout`);
      try {
        router.push({ name: isAgent ? 'agentLanding' : 'index' });
      } catch (e) {
        // 有些商户没有代理落地页，push报错的话，直接跳首页
        router.push({ name: 'index' });
      }
    }

    if (errorFlag && !checkWhiteList(response)) {
      if (isLogout <= 1) {
        ElMessage.error({
          message: response.data.msg,
          onClose() {
            isLogout = 0;
          },
        });
      }
      return Promise.reject(response.data.msg);
    }
    return response.data.data;
  },
  // (error) => {
  //   if (error.message !== 'cancel') {
  //     ElMessage.error(`服务器错误${error.config.url}`);
  //   }
  //   return Promise.reject(error);
  // },
  (error) => {
    fullScreenLoading?.close?.();
    return Promise.reject(error);
  },
);

export async function request(url, params) {
  const { CACHE, key, config } = resetParams({
    instance,
    url,
    params,
    store,
  });

  // isServer && console.log('\x1b[92m', '预检地址：', '\x1b[94m', url, '\x1b[92m', `命中缓存：${cache.has(key)}`);
  // if (CACHE && cache.has(key)) {
  //   return cache.get(key);
  // }
  return instance(config).then(
    (res) =>
      // isServer && console.log('\x1b[91m', '请求地址：', '\x1b[97m', url, '\x1b[91m', `命中缓存：${cache.has(key)}`);
      // CACHE && cache.set(key, res);
      res,
  );
}
