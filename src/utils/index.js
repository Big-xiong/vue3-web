/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
import { reactive } from 'vue';
import dayjs from 'dayjs';

export const isPromise = (obj) =>
  !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';

class ImportError extends Error {
}

const allDialog = import.meta.glob('/src/components/Dialog/*.vue');
const loadedDialog = reactive({});
export const loadModule = async (modulePath) => {
  if (loadedDialog[modulePath]) {
    return loadedDialog[modulePath];
  }
  try {
    const dialog = await allDialog[modulePath]();
    loadedDialog[modulePath] = dialog;
    return dialog;
  } catch (e) {
    throw new ImportError(`找不到模块路径 ${modulePath}`);
  }
};

export const priceFormat = (price) =>
  price.toString()
    .indexOf('.') !== -1
    ? `${price
      .toString()
      .split('.')[0]
      .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') || 0
    }.${price.toString()
      .split('.')[1]}`
    : `${price.toString()
      .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') || 0}.00`;

export async function getClipboardText() {
  try {
    const text = await navigator.clipboard.readText();
    return text;
    // 一些操作
  } catch (e) {
    console.error(`从剪切板获取数据失败: ${e}`);
  }
}
export const timeFilter = (str) => str.substr(0, 10);

export const dateFormat = (format = 'YYYY-MM-DD HH:mm:ss', date = new Date()) => dayjs(date).format(format);

export const download = (url, name) => {
  const a = document.createElement('a');
  const event = new MouseEvent('click');
  a.download = `${name || new Date().getTime()}.png`;
  a.href = url;
  a.dispatchEvent(event);
};

export function getParams(name) {
  const { search } = location;
  if (search.includes(name)) {
    return new URLSearchParams(search).get(name);
  }
}

export function getPic(item, app) {
  if (item?.inte_pic) {
    let lang = app.lang;
    lang = lang === 'vi' ? 'vn' : lang;
    return JSON.parse(item.inte_pic)[lang];
  }
}

export function priceUnitTransform(value) {
  // 兼容业务逻辑中已经被按千分位格式化过的value
  let money = Number(String(value)
    .replaceAll(',', ''));
  let unit = '';

  if (money < 1000000) {
    return {
      money: priceFormat(money),
      unit,
    };
  }

  const config = {
    3: {
      unit: '',
      divide: 1,
    },
    6: {
      unit: 'K',
      divide: 10 ** 3,
    },
    9: {
      unit: 'M',
      divide: 10 ** 6,
    },
    12: {
      unit: 'B',
      divide: 10 ** 9,
    },
    15: {
      unit: 'T',
      divide: 10 ** 12,
    },
  };

  Object.keys(config)
    .forEach((key) => {
      if (money.toFixed().length <= Number(key) && !unit) {
        money = Number((money / config[key].divide).toFixed(2));
        // console.log('789', money);
        unit = config[key].unit;
      }
    });

  return {
    money,
    unit,
  };
}

export function parseMoney(num) {
  if (!num || Number(num) <= 1 || !/^\d+$/.test(Number(num))) {
    return num;
  }
  const moneyUnits = ['', '万', '亿', '万亿'];
  const dividend = 10000;
  let currentNum = num;
  // 转换数字
  let currentUnit = moneyUnits[0];
  // 转换单位
  for (let i = 0; i < 4; i += 1) {
    currentUnit = moneyUnits[i];
    if (strNumSize(currentNum) < 5) {
      break;
    }
    currentNum /= dividend;
    currentNum = String(currentNum)?.split?.('.')?.[0];
  }
  const m = {
    num: 0,
    unit: '',
  };
  m.num = Number(currentNum);// .toFixed(2);
  m.unit = currentUnit;
  return `${m.num}${m.unit}`;
}

function strNumSize(tempNum) {
  let stringNum = tempNum.toString();
  const index = stringNum.indexOf('.');
  if (index > -1) {
    stringNum = stringNum.substring(0, index);
  }
  return stringNum.length;
}

export function escape2Html(str) {
  const arrEntities = {
    lt: '<',
    gt: '>',
    nbsp: ' ',
    amp: '&',
    quot: '"',
  };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, (all, t) => arrEntities[t]);
}

export const executeScript = (html) => {
  // eslint-disable-next-line no-control-regex
  const reg = /(src=['|"])([a-z\d\.\-\/])+/gi;
  let src = html.match(reg)?.[0];
  console.log(window.location.pathname);
  if (src && window.location.pathname.indexOf('/play') < 0) {
    src = src.replace(/^src=['|"]/, '');
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
  }
};

export const executeScriptStat = (html) => {
  // var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  // const ehtml = escape2Html(html);
  // const h = ehtml.split('<script>');
  // const src = ehtml.match(srcReg)[1];

  // if (src) {
  //   const hm = document.createElement('script');
  //   hm.src = src;
  //   const s = document.getElementsByTagName('script')[0];
  //   s.parentNode.insertBefore(hm, s);

  //   const scriptText = document.createElement('script');
  //   scriptText.innerHTML = h[1].split('</script>')[0];
  //   const t = document.getElementsByTagName('script')[0];
  //   t.parentNode.insertBefore(scriptText, t.nextSibling);
  // }
};

export async function getAreaCodeFromRegion(store, regionId) {
  await store.dispatch('app/getDict', ['phoneareav3', 'regionlist']);

  let regionName = '';
  store.state.app.dicts.regionlist.forEach((item) => {
    if (item.id === regionId) {
      regionName = item.name;
    }
  });

  let areaCode = '';
  store.state.app.dicts.phoneareav3.forEach((item) => {
    if (item.includes(regionName)) {
      const splited = item.split('-');
      areaCode = splited[splited.length - 1];
    }
  });

  return areaCode;
}

let insertKF = true;
// 插入客服
export async function doInsertKF(key) {
  if (key === 'siteinfo' && !insertKF) {
    insertKF = true;
    // eslint-disable-next-line prefer-const
    let { email, username, mobile } = store.state.user?.userInfo ?? {};
    if (!email) {
      email = localStorage.getItem('email') ?? `${new Date().getTime()}@test.com`;
      localStorage.setItem('email', email);
    }
    const res = await fetch(
      `https://userapi.blizzwin.com/chat_token?email=${email}&firstname=${username ?? 'Visitor'}&lastname=${mobile ?? '[No mobile number]'
      }`,
    ).then((res) => res.json());
    window.hsConversationsSettings = {
      loadImmediately: false,
      identificationEmail: email,
      identificationToken: res?.data?.token ?? '',
    };

    // if (import.meta.env.NODE_ENV === 'production') {
    //   executeScriptStat(val.pc_stat);
    // }

    setTimeout(() => {
      // if (import.meta.env.NODE_ENV === 'production') {
      // executeScriptStat(val.pc_stat);
      // }
      if (import.meta.env.NODE_ENV === 'production') {
        executeScript(val.pc_kf_js);
      }
      const timer = setInterval(() => {
        window.HubSpotConversations?.widget?.load?.({ widgetOpen: true });
        if (window.HubSpotConversations?.widget?.status?.()?.loaded) {
          clearInterval(timer);
          // window.HubSpotConversations?.widget?.open?.()
        }
      }, 500);
    }, 1000);
  }
}
