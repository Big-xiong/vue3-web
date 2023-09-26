import Cookies from 'js-cookie';
// import io from 'socket.io-client';
import { i18n } from '@/init';
import { doInsertKF, getParams } from '@/utils';
import * as dictsApi from '@/api/dicts';

const socketHost = window.location.protocol === 'http' ? 'http://roadmap.9mbv.com:8080' : 'https://roadmap.9mbv.com:7070';
let subConfig = import.meta.globEager('/src/current_project/config/index.js');
subConfig = Object.values(subConfig)?.[0]?.default ?? { isI18n: true };

export default () => ({
  namespaced: true,
  state: {
    darkTheme: false,
    lang: '',
    dicts: {},
    caches: {},
    headers: {
      'X-Inte-Region-Id': '',
      'X-Inte-Currency-Id': '',
    },
    agentHeaders: {
      'X-Inte-Region-Id': '',
      'X-Inte-Currency-Id': '',
    },
    regionId: '',
    currencyId: '',
    source: '',
    appLang: '',
    langMatchingAreaCode: '',
    isLangMatching: false,
    noticeList: [], // siteNoticeBox组件轮询sitenotice接口得到的公告列表
    lastNoticeType: '', // 最后点击的tab类型 message站内信 notice公告
    roadmapSocketType: '',
    roadmapSocketData: {},
  },
  getters: {},
  mutations: {
    SET_ROADMAP_SOCKET_MESSAGE(state, { data, type }) {
      state.roadmapSocketData = data;
      state.roadmapSocketType = type;
    },
    SET_SOCKET_CONNECT(state, { status, instance }) {
      state.isSocketConnected = status;
      state.socketInstance = instance;
    },
    SET_SOURCE(state) {
      state.appLang = getParams('lang') || '';
      state.source = getParams('source') || '';
    },
    SET_DARK_THEME(state, status) {
      if (state.darkTheme === status) return;
      Cookies.set('darkTheme', status ?? !state.darkTheme);
      state.darkTheme = status ?? !state.darkTheme;
      if (state.darkTheme) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    },
    SET_NOTICE_DATA(state, payload) {
      state.noticeData = payload;
    },
    SET_HEADERS(state, {
      regionId, currencyId, isAgent, isLangMatching, matchingAreaCode,
    }) {
      if (isAgent) {
        state.agentHeaders['X-Inte-Region-Id'] = regionId;
        state.agentHeaders['X-Inte-Currency-Id'] = currencyId;
      } else {
        state.headers['X-Inte-Region-Id'] = regionId === '' ? state.regionId : regionId;
        state.headers['X-Inte-Currency-Id'] = currencyId === '' ? state.currencyId : currencyId;
      }
      // 用来备份node server预请求的内容 用作退出还原
      if (state.regionId === '' && regionId) {
        state.regionId = regionId;
        state.currencyId = currencyId;
      }

      state.langMatchingAreaCode = matchingAreaCode;
      state.isLangMatching = isLangMatching;
    },
    SET_LANG(state, lang) {
      if (Cookies.get('lang') !== lang) {
        if (subConfig.isI18n) {
          const [_, ...args] = window.location.pathname.substr(1).split('/');
          const params = location.href.split('?')[1];
          window.location = `${window.location.origin}/${lang}/${args.join('/')}${params ? `?${params}` : ''}`;
        }
        Cookies.set('lang', lang);
      } else {
        state.lang = lang;
        i18n.global.locale = lang;
      }
    },
    async SET_CONSTANT(state, { key, val }) {
      let values = val;
      if (key === 'platformgameidsv2') {
        values = values.map((item) => {
          item.platform_list = item.list_data.filter((child) => child.status !== 2);
          return item;
        });
      }

      doInsertKF(key);

      state.dicts[key] = values;
    },
    UPDATE_SITE_NOTICE(state, values) {
      state.noticeList = values;
    },
    UPDATE_SITE_NOTICE_READ(state, id) {
      const idx = state.noticeList.findIndex((item) => item.id === Number(id));
      state.noticeList[idx].is_read = 1;
    },
    LAST_NOTICE_TYPE(state, payload) {
      state.lastNoticeType = payload;
    },
  },
  actions: {
    connectSocket({ commit }) {
      const socket = io(socketHost, {
        transports: ['websocket'], // use WebSocket first, if available
      });
      socket.on('connect', () => {
        console.log('socket connected');
      });
      socket.on('connect_error', () => {
        console.error('connect');
      });
      socket.on('connect', () => {
        commit('SET_SOCKET_CONNECT', { status: true, instance: socket });
      });
      socket.on('connect_error', () => { });
      socket.on('result list', (msg) => {
        commit('SET_ROADMAP_SOCKET_MESSAGE', {
          data: JSON.parse(msg),
          type: 'resultList',
        });
      });
      socket.on('new shoes', (msg) => {
        commit('SET_ROADMAP_SOCKET_MESSAGE', {
          data: JSON.parse(msg),
          type: 'newShoes',
        });
      });
      socket.on('new round', (msg) => {
        commit('SET_ROADMAP_SOCKET_MESSAGE', {
          data: JSON.parse(msg),
          type: 'newRound',
        });
      });
      socket.on('close round', (msg) => {
        commit('SET_ROADMAP_SOCKET_MESSAGE', {
          data: JSON.parse(msg),
          type: 'closeRound',
        });
      });
      socket.on('disconnect', () => {
        commit('SET_SOCKET_CONNECT', { status: false, instance: false });
      });
    },
    disconnectSocket({ state, commit }) {
      commit('SET_SOCKET_CONNECT', { status: false, instance: null });
      commit('SET_ROADMAP_SOCKET_MESSAGE', { data: {}, type: '' }); // bug #19526
      const socket = state.socketInstance;
      socket.disconnect();
      socket.removeAllListeners('result list');
      socket.removeAllListeners('new shoes');
      socket.removeAllListeners('new round');
      socket.removeAllListeners('close round');
      socket.removeAllListeners('connect');
      socket.removeAllListeners('disconnect');
      socket.removeAllListeners('connect_error');
    },
    getDict({ state, commit }, type) {
      const fetchDict = (name) => {
        // if (state.dicts[name]?.length || state.dicts[`${name}Loading`]) return;
        doInsertKF(name);

        commit('SET_CONSTANT', { key: `${name}Loading`, val: true });
        return dictsApi[name]?.()
          .then((res) => {
            commit('SET_CONSTANT', { key: name, val: res });
            commit('SET_CONSTANT', { key: `${name}Loading`, val: false });
            return res;
          })
          .catch((e) => {
            commit('SET_CONSTANT', { key: `${name}Loading`, val: false });
            return false;
          });
      };
      if (Array.isArray(type)) {
        return Promise.allSettled(type.map(fetchDict));
      }
      return fetchDict(type);
    },
    updateSiteNotice({ state, commit }, noticeArray) {
      commit('UPDATE_SITE_NOTICE', noticeArray);
    },
    updateSiteNoticeRead({ state, commit }, id) {
      commit('UPDATE_SITE_NOTICE_READ', id);
    },
  },
});
