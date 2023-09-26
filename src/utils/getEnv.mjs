import fs from 'fs';
import path from 'path';
import request from 'request-promise';

function getSubConfig(target) {
  let subEnv = fs.readFileSync(path.resolve('./src/current_project/config/index.js')).toString();

  subEnv = subEnv.split('\n').filter(Boolean);
  subEnv.shift();
  subEnv.pop();
  subEnv = subEnv.map((item) => item.replace(/ /g, ''));
  subEnv = subEnv.map((item) => (item.includes('//') ? item.substr(0, item.indexOf('//')) : item));
  subEnv = subEnv.map((item) => (item[item.length - 1] === ',' ? item.substr(0, item.length - 1) : item));
  for (let i = 0; i < subEnv.length; i += 1) {
    const item = subEnv[i] ?? '';
    const first = item?.[0];
    const last = item[item.length - 1];
    if (last === '{') {
      subEnv[i] = `${item}${subEnv[i + 1]}`;
      subEnv[i + 1] = null;
    }
    if (first === '}') {
      subEnv[i - 2] = `${subEnv[i - 2]}${item}`;
      subEnv[i] = null;
    }
  }

  subEnv = subEnv.filter(Boolean).reduce((curr, next) => {
    const splitIndex = next.indexOf(':');
    const [key, value] = [next.substr(0, splitIndex), next.substr(splitIndex + 1)];
    // eslint-disable-next-line no-eval
    curr[key] = eval(`(${value})`);
    return curr;
  }, {});
  return target ? subEnv[target] : subEnv;
}

export default async function getEnv(no, useProdInterface, useDev = false) {
  const testUseProdInterface = getSubConfig('testUseProdInterface');
  const merchantNo = no;
  // 判断运行参数参数
  if (useProdInterface || useDev) {
    no = useProdInterface ? no : useDev ? 19001 : no;
  } else {
    // 判断配置文件
    no = testUseProdInterface ? (/^\d+$/.test(testUseProdInterface) ? testUseProdInterface : no) : 19001;
  }

  const res = await request({
    url: `https://api.acebetsabo.com/frontend_env?xxt=RcvUKKAi31xJqsXx&no=${no}`,
    json: true,
    headers: {
      'User-Agent': 'Request-Promise'
    }
  });
  if (res?.code === 200) {
    const { VUE_APP_ASSET_PATH, VUE_APP_H5_API_URL, VUE_APP_ADMIN_API_URL, ...args } = res.data;
    const envInfo = Object.entries(args).reduce((curr, next) => {
      const [key, value] = next;
      curr[key.replace('VUE_', 'VITE_')] =
        no === 19001 && key.includes('_APP_GAME_DOMAIN')
          ? `${merchantNo}.web.wq-test.com`
          : `${value?.replace?.('{jumptype}', 'www')}`;
      return curr;
    }, {});
    return {
      str: Object.entries(envInfo).reduce((curr, next) => ((curr += `${next[0]}=${next[1]} `), curr), ''),
      obj: envInfo
    };
  }

  throw new Error('获取线上配置失败');
}
