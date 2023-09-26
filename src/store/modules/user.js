/* eslint-disable no-unused-vars */
import Cookies from 'js-cookie';
import currentConfig from '@current/config';
import {
  register, quickregister, login, member, wallet, mobileLogin, mobileregister,
} from '@/api/user';

let getUserInfoLoading = false;

export default () => ({
  namespaced: true,
  state: {
    currencySymbol: '',
    isLogin: false,
    gottenUserInfo: true,
    userInfo: {},
    walletInfo: {},
    loginDialog: false,
    loginLoading: false,
    registerDialog: false,
    registerLoading: false,
    updateLoading: false,
    walletLoading: false,
    uploadWalletLoading: false,
    bindMobile: false,
    loginActiveName: 'account',
    password: '', // 注册成功页点击“修改密码”后的密码 bug#19338
  },
  mutations: {
    SET_GOT_USERINFO(state, payload) {
      state.gottenUserInfo = payload;
    },
    SET_REGISTER_DIALOG(state, val) {
      state.registerDialog = val;
    },
    SET_LOGIN_DIALOG(state, val) {
      state.loginDialog = val;
      state.loginActiveName = 'account';
    },
    SET_LOGIN_ACTIVENAME(state, val) {
      state.loginActiveName = val;
    },
    SET_USER_INFO(state, val) {
      state.isLogin = !!Object.keys(val).length;
      state.userInfo = val;
    },
    SET_WALLET_INFO(state, val) {
      state.walletInfo = val;
    },
    SET_LOADING(state, { key, val }) {
      state[key] = val;
    },
    SET_BINDMOBILE_DIALOG(state, val) {
      state.bindMobile = val;
    },
    SET_CURRENCY_SYMBOL(state, payload) {
      state.currencySymbol = payload;
    },
    SET_PASSWORD(state, payload) {
      state.password = payload;
    },
  },
  actions: {
    register({ state, commit, dispatch }, data) {
      const {
        name,
        data: { clause, ...registerInfo },
      } = data;
      commit('SET_LOADING', { key: 'registerLoading', val: true });
      const fn = { account: register, quick: quickregister, mobile: mobileregister };
      return fn[name]({ ...registerInfo, domain: document.domain })
        .then((res) => {
          const { repassword, ...loginInfo } = registerInfo;
          const { username, password } = res;
          const loginParams = password ? { username, password } : loginInfo;
          return dispatch('login', loginParams).then(() => {
            Cookies.set('pwd', loginParams.password);
            return Promise.resolve('success');
          });
        })
        .finally(() => {
          commit('SET_LOADING', { key: 'registerLoading', val: false });
        });
    },
    login({ commit, dispatch }, data) {
      commit('SET_LOADING', { key: 'loginLoading', val: true });
      return login(data)
        .then((res) => {
          const { access_token } = res;
          Cookies.set('access_token', access_token);
          dispatch('getWalletInfo');
          // commit('SET_GOT_USERINFO', true);
          return dispatch('getUserInfo');
        })
        .catch((err) => {
          commit('SET_LOADING', { key: 'loginLoading', val: false });
        });
    },
    mobileLogin({ commit, dispatch }, data) {
      commit('SET_LOADING', { key: 'loginLoading', val: true });
      return mobileLogin(data)
        .then((res) => {
          const { access_token } = res;
          Cookies.set('access_token', access_token);
          dispatch('getWalletInfo');
          return dispatch('getUserInfo');
        })
        .catch((err) => {
          commit('SET_LOADING', { key: 'loginLoading', val: false });
        });
    },
    getUserInfo({ state, commit, dispatch }, fn) {
      if (getUserInfoLoading) return;
      if (!fn) commit('SET_LOADING', { key: 'loginLoading', val: true });
      getUserInfoLoading = true;
      return member()
        .then((res) => {
          commit('SET_USER_INFO', res);
          commit('SET_LOGIN_DIALOG', false);
          commit('SET_CURRENCY_SYMBOL', res.currency_detail.symbol);
          if (currentConfig.isCurrency) {
            commit(
              'app/SET_HEADERS',
              {
                regionId: res?.inte_region_id,
                currencyId: res?.inte_currency_id,
                isMatching: true,
              },
              { root: true },
            );
          }

          dispatch('getWalletInfo');
          dispatch('app/getDict', 'siteinfo', { root: true });
          return Promise.resolve('success');
        })
        .catch(() => {
          console.error('error getting userinfo');
        })
        .finally(() => {
          fn?.();
          if (!fn) commit('SET_LOADING', { key: 'loginLoading', val: false });
          commit('SET_GOT_USERINFO', true);
          getUserInfoLoading = false;
        });
    },
    updateUserInfo({ commit, dispatch }) {
      commit('SET_LOADING', { key: 'updateLoading', val: true });
      dispatch('getUserInfo', () => {
        commit('SET_LOADING', { key: 'updateLoading', val: false });
      });
    },
    // bug#19338 修改后的密码显示到success页面
    updateUserPassword({ commit }, data) {
      commit('SET_PASSWORD', data);
    },
    getWalletInfo({ state, commit }) {
      const isRefresh = !!Object.keys(state.walletInfo).length;
      commit('SET_LOADING', { key: isRefresh ? 'uploadWalletLoading' : 'walletLoading', val: true });
      return wallet()
        .then((res) => {
          commit('SET_WALLET_INFO', res);
          return res;
        })
        .finally(() => {
          // setTimeout(() => {
          commit('SET_LOADING', { key: isRefresh ? 'uploadWalletLoading' : 'walletLoading', val: false });
          // }, 1000);
        });
    },
    logout({ commit }) {
      Cookies.remove('access_token');
      Cookies.remove('pwd');
      sessionStorage.removeItem('agentCode');
      commit('SET_USER_INFO', {});
      commit('SET_LOGIN_DIALOG', false);
      commit('SET_LOADING', { key: 'loginLoading', val: false });
      commit('SET_CURRENCY_SYMBOL', '');
      commit(
        'app/SET_HEADERS',
        {
          regionId: '',
          currencyId: '',
        },
        { root: true },
      );
      return Promise.resolve();
    },
  },
});
