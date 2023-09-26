import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import Cookies from 'js-cookie';
import { getHeaders, getRegionLang } from '@/api/app';
import { getLang } from '@/utils/hooks';
import { langConfig } from '@/utils/config';

let restrited = false;

const defaultModules = import.meta.globEager('/src/router/modules/*.js');
const subModules = import.meta.globEager('/src/current_project/router/*.js');

let subConfig = import.meta.globEager('/src/current_project/config/index.js');
subConfig = Object.values(subConfig)?.[0]?.default ?? { isI18n: true };

export default async (store) => {
  if (subConfig.isCurrency) {
    const headerRes = await getHeaders(store);
    restrited = !headerRes.isMatching;

    if (location.href.includes('test') || location.href.includes('localhost')) {
      restrited = false;
    }
  } else if (Cookies.get('access_token')) {
    await store.dispatch('user/getUserInfo');
  }

  let lang = '';
  let defaultLang = '';
  if (subConfig.isI18n) {
    lang = window.location.pathname.substr(1).split('/')[0];
    if (!lang || !langConfig.includes(lang)) {
      await getRegionLang().then((result) => {
        const { language } = navigator;
        result = getLang(result || '');
        const localLang = getLang(language);
        if (localLang === result) {
          lang = result;
        } else {
          lang = 'en';
        }
      });
    }
    defaultLang = lang;
  } else {
    defaultLang = 'zh-CN';
  }
  Cookies.set('lang', defaultLang);
  store.commit('app/SET_LANG', defaultLang, { root: true });

  setTimeout(() => {
    try {
      window.eval(store._state.data.app?.dicts?.siteinfo?.pc_stat ?? '');
    } catch (e) { }
  }, 6000);

  // 合并主从架构路由
  const diffRouterModules = Object.entries({ ...defaultModules, ...subModules }).reduce((curr, next) => {
    const key = next[0].split('/').pop().replace('.js', '');
    curr[key] = next[1].default;
    return curr;
  }, {});
  const { index, error, ...routerModules } = diffRouterModules;
  let routes = [...index(), ...[].concat(...Object.values(routerModules).map((fn) => fn())), ...error()];
  if (import.meta.env.VITE_APP_MICRO === 'micro') {
    routes = routes.filter((item) => item.path === '/center' || item.path === '/affiliate' || item.name === '404');
  }

  const router = createRouter({
    history: createWebHistory(lang),
    routes,
    scrollBehavior() {
      return {
        top: 0,
        behavior: 'smooth',
      };
    },
  });

  // 进度条配置
  NProgress.configure({
    easing: 'ease', // 动画方式
    speed: 500, // 递增进度条的速度
    showSpinner: true, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3, // 初始化时的最小百分比
  });

  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    // /agent/landing
    if (to.path === '/agent/landing') {
      return next({ name: 'agentLanding', query: { id: to.query.id } });
    }

    // 落地页不需要ip限制
    if (to.name === 'landing') {
      if (location.host === 'blizzwin.online') {
        return next();
      }
      return next({ name: '404' });
    }

    if (restrited && to.name !== 'restricted') {
      NProgress.done();
      return next({ name: 'restricted' });
    }

    if (!restrited && to.name === 'restricted') {
      return next({ name: 'index' });
    }

    if (!store) {
      next();
      return;
    }

    // 已登录状态不允许访问注册页面
    if (to.name === 'register' && store._state.data.user.isLogin) {
      return next({ name: 'index' });
    }

    // if (to.query.at) {
    //   Cookies.set('access_token', to.query.at);
    //   store.dispatch('user/getUserInfo');
    //   return next();
    // }

    // 谷歌统计
    const gtag = window.gtag;
    if (gtag) {
      gtag('set', 'page_path', to.path);
      gtag('event', 'page_view');
    }

    // 代理注册id
    if (to.query.id) {
      window.sessionStorage.setItem('agentCode', to.query.id);
    }

    // 邀请好友注册
    if (to.query.code && to.name === 'index') {
      sessionStorage.setItem('spread_code', to.query.code);
    }

    if (store) {
      if (to.path?.startsWith('/center') && !store.state.user.isLogin && to.name !== 'centerNotice') {
        store.dispatch('user/getUserInfo');
      }

      // 如果从代理中心已登录状态下点击退出回到代理落地页，点击浏览后退按钮时回到首页 bug: #24730
      if (from.name === 'agentLanding' && to.path.startsWith('/affiliate')) {
        if (!Cookies.get('agent_access_token')) {
          next('/');
          return
        }
      }

      // 如果进入代理中心未登录，跳转到代理落地页，反之直接进入代理首页
      if (to.name?.includes('affiliate')) {
        if (!store.state.agent.isLogin) {
          if (Cookies.get('agent_access_token')) {
            await store.dispatch('agent/getUserInfo');
          } else {
            next();
            return;
          }
        }
        next('/affiliate/home');
        return;
      }
    }

    next();
  });

  router.afterEach((to, from) => {
    NProgress.done();
    return true;
  });

  return {
    router,
  };
};
