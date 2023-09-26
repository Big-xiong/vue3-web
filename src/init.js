/* eslint-disable import/no-mutable-exports */
import el from 'element-plus';
import Cookies from 'js-cookie';
import VueClipboard from 'vue3-clipboard';
import { createI18n } from 'vue-i18n/index';
import { createApp } from 'vue';
import zhLocale from 'element-plus/lib/locale/lang/zh-cn';
import enLocale from 'element-plus/lib/locale/lang/en';
import { $getSrc } from '@/utils/getSrc.js';
// import twLocale from 'element-plus/lib/locale/lang/zh-tw';
// import thLocale from 'element-plus/lib/locale/lang/th';
// import viLocale from 'element-plus/lib/locale/lang/vi';

import SvgIcon from '@/components/SvgIcon.vue';
import AcbLogo from '@/components/Layout/footer/components/AcbLogo.vue';
import dialog from '@/plugins/dialog';
import createStore from './store';
import createRouter from './router';
import globalFunc from '@/utils/globalFunc';
import directives from './directives';
import localeEn from '/public/language/en';
// import localeTh from '/public/language/th';
// import localeVi from '/public/language/vi';
// import localeTw from '/public/language/zh-TW';

import currentEn from '/src/current_project/i18n/en';
// import currentTh from '/src/current_project/i18n/th';
// import currentVi from '/src/current_project/i18n/vi';
// import currentTw from '/src/current_project/i18n/zh-TW';

import App from './App.vue';

import 'normalize.css';
import '@/assets/root.scss';
import '@/assets/style/global.scss';
import '@/assets/dark.scss';
import '@current/config/style.scss';
import 'nprogress/nprogress.css';
import { getParams } from './utils';

let subConfig = import.meta.globEager('/src/current_project/config/index.js');
subConfig = Object.values(subConfig)?.[0]?.default;

Cookies.set('showEnterLoading', subConfig.showEnterLoading);

if (window) {
  // 为兼容OSS加速后open打开链接
  const globalOpen = window.open;
  window.open = (url, ...args) => {
    const prefix = !url || /^http:\/\/|https:\/\/|\/\//.test(url) ? '' : window.location.origin;
    return globalOpen(`${prefix}${url}`, ...args);
  };
}

// 多语言插件设置
export const i18n = createI18n({
  locale: Cookies.get('lang') || 'zh-CN',
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  missingWarn: false,
  messages: {
    'zh-CN': {
      el: zhLocale.el,
      ...Object.keys(localeEn).reduce((curr, next) => ((curr[next] = next), curr), {}),
      ...Object.keys(currentEn).reduce((curr, next) => ((curr[next] = next), curr), {}),
    },
    en: {
      el: enLocale.el,
      ...localeEn,
      ...currentEn,
    },
    // th: {
    //   el: thLocale.el,
    //   ...localeTh,
    //   ...currentTh,
    // },
    // vi: {
    //   el: viLocale.el,
    //   ...localeVi,
    //   ...currentVi,
    // },
    // 'zh-TW': {
    //   el: twLocale.el,
    //   ...localeTw,
    //   ...currentTw,
    // },
  },
});

export let router;
export let store;

export default async (instance, regionLang) => {
  if (getParams('at')) {
    Cookies.set('access_token', getParams('at'));
  }

  const app = instance || createApp(App);
  if (!instance) {
    store = createStore();
    const { router: _router } = await createRouter(store, app);
    router = _router;
  }

  // 注入seo
  if (regionLang && i18n.global.locale !== regionLang) {
    i18n.global.locale = regionLang;
  }

  app.use(router)
    .use(store);
  app.use(el, {
    i18n: i18n.global.t,
  });
  app.use(dialog);
  app.use(i18n);

  // 注册全局方法，如游戏相关功能
  globalFunc(app, router, store, i18n.global.t);

  const global = Object.assign(app.config.globalProperties, { $t: i18n.global.t });
  app.provide('global', global);
  app.provide('store', global.$store);
  app.provide('getRootStyle', (value, dom) => getComputedStyle(
    dom ? document.querySelector(dom) : document[global.$store.state.app.darkTheme ? 'body' : 'documentElement'],
  ).getPropertyValue(value));
  app.provide('$t', i18n.global.t);

  // 子分支配置
  app.provide('subConfig', subConfig);
  app.config.globalProperties.$getSrc = (path, defaultPath) => $getSrc(store, path, defaultPath);

  app.config.errorHandler = (err, vm, info) => {
    // 处理错误
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // console.log(err, vm, info);
  };

  window.$t = i18n.global.t;
  // 剪切板引入
  app.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  });
  app.component('svg-icon', SvgIcon);
  app.component('acb-logo', AcbLogo);
  // 注册自定义指令
  directives(app, store);

  return {
    app,
    store,
    router,
  };
};
