// import md5 from 'md5';
import Cookies from 'js-cookie';

// response拦截器白名单
const responseWhiteList = ['/agent_online_check'];
export function checkWhiteList(response) {
  const url = response.config.url;
  return responseWhiteList.some((item) => url.includes(item));
}

// 获取货币id 地区id
function getRegionInfo(store, isAgent) {
  const app = store?._state?.data?.app;
  const headers = app?.headers ?? {};
  const agentHeaders = app?.agentHeaders ?? {};
  // const { headers, agentHeaders } = store?._state?.data?.app;
  const _headers = isAgent ? agentHeaders : headers;
  return {
    headers: _headers,
    regionInfo: {
      inte_currency_id: _headers['X-Inte-Currency-Id'],
      inte_region_id: _headers['X-Inte-Region-Id'],
    },
  };
}

/*
config:{
  url,
  method,
  params,
} */
// 上行参数处理
export function resetParams({
  instance, url, params, store,
}) {
  let config = url;
  if (typeof url === 'string') {
    config = { url, ...params };
  }
  const lang = Cookies.get('lang') === 'zh-CN' ? 'zh' : Cookies.get('lang') || 'zh';
  const type = config.method === 'get' ? 'params' : 'data';

  const { CACHE = false, ISAGENT } = config[type] ?? {};
  const _url = config.baseURL || config.url;
  const _isAgent = ISAGENT || _url?.includes('agentapi');

  let subConfig = import.meta.globEager('/src/current_project/config/index.js');
  subConfig = Object.values(subConfig)?.[0]?.default;

  let defaultHeaders = instance.defaults.headers;
  if (subConfig.isCurrency) {
    const { regionInfo, headers } = getRegionInfo(store, _isAgent);
    defaultHeaders = { ...defaultHeaders, ...headers };
    config[type] = { ...regionInfo, ...config[type], lang };
  } else {
    config[type] = { ...config[type], lang };
  }
  // console.log(_url, regionInfo, 'xxxxxxx');
  if (CACHE) delete config[type].CACHE;
  if (ISAGENT) delete config[type].ISAGENT;

  instance.defaults.headers = { ...defaultHeaders };

  return {
    CACHE,
    // key: md5(url + JSON.stringify(config[type])),
    config,
  };
}
