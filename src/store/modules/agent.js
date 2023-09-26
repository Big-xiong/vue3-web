import Cookies from 'js-cookie';
import {
  agentonlinecheck, agentsettingdetail, login, userinfo,
  allbanklist, devtypelist,
  auditstatuslist, memberlevellist,
} from '@/api/agent';

export default () => ({
  namespaced: true,
  state: {
    isLogin: false,
    currencySymbol: '',
    userInfo: {},
    // 登录弹窗
    loginVisible: false,
    // 注册弹窗
    registerVisible: false,
    // 绑定银行卡弹窗
    bankcardAddVisible: false,
    // 修改密码弹窗
    changePasswordVisible: false,
    // 开户弹窗
    createAccountVisible: false,
    // 开户弹窗
    withdrawVisible: false,
    // 等级数据
    memberLevelList: [],
    // 账变类型
    memberAccountType: [],
    // 佣金状态
    commissionStatus: [],
    // 银行列表
    bankList: [],
    // 推广设备
    devTypeList: {},
    // 遗漏状态
    omitStatusList: {},
  },
  actions: {
    async getDevTypeList({ commit }) {
      commit('GET_DEV_TYPE_LIST', await devtypelist());
    },
    async getOmitStatusList({ commit }) {
      commit('GET_OMIT_STATUS_LIST', await auditstatuslist());
    },
    async getBankList({ commit }) {
      commit('GET_BANK_LIST', await allbanklist());
    },
    async setCommissionStatus({ commit }, payload) {
      commit('SET_COMMISSION_STATUS', payload);
    },
    async setMemberAccountType({ commit }, payload) {
      commit('SET_MEMBER_ACCOUNT_TYPE', payload);
    },
    async setMemberLevelList({ commit }) {
      const result = await memberlevellist();
      commit('SET_MEMBER_LEVEL_LIST', result.map((item) => ({
        ...item,
        label: item.name,
        value: item.level,
      })));
    },
    updateUserInfo({ commit }, data) {
      commit('SET_AGENT_USER_INFO', data);
    },
    async getUserInfo({ dispatch, commit }, params) {
      const result = await userinfo(params);
      // console.log(result, 'userinfo----------------------');
      if (result) {
        commit('SET_LOGIN', true);
        commit(
          'app/SET_HEADERS',
          {
            regionId: result.inte_region_id,
            currencyId: result.inte_currency_id,
            isAgent: true,
          },
          { root: true },
        );
        dispatch('getSettingDetail', result);
      }
    },
    async getSettingDetail({ commit }, params) {
      const loginData = { ...params };
      const settingResult = await agentsettingdetail({ access_token: loginData.access_token });
      if (settingResult.deposit_config && !loginData.deposit_switch) {
        loginData.deposit_switch = settingResult.deposit_config;
      }
      if (settingResult.unlimited_level_config && !loginData.spread_switch) {
        loginData.spread_switch = settingResult.unlimited_level_config;
      }
      commit('SET_AGENT_USER_INFO', loginData);
      commit('SET_CURRENCY_SYMBOL', params.currency.symbol);
    },
    async login({ dispatch }, params) {
      const loginResult = await login(params);
      if (loginResult) {
        if (typeof localStorage !== 'undefined') {
          Cookies.set('agent_access_token', loginResult.access_token);
        }
        dispatch('getUserInfo', loginResult);
      }
    },
    setLoginVisible({ commit }, visible) {
      commit('SET_AGENT_LOGIN_VISIBLE', visible);
    },
    setResigerModel({ commit }, visible) {
      commit('SET_AGENT_REGISTER_VISIBLE', visible);
    },
    setBankcardAddVisible({ commit }, visible) {
      commit('SET_BANKCARD_ADD_VISIBLE', visible);
    },
    setChangePasswordVisible({ commit }, visible) {
      commit('SET_CHANGE_PASSWORD_VISIBLE', visible);
    },
    setCreateAccountVisible({ commit }, visible) {
      commit('SET_CREATE_ACCOUNT_VISIBLE', visible);
    },
    setWithdrawVisible({ commit, state }, visible) {
      if (state.userInfo.agent_bank.length === 0) {
        setTimeout(() => {
          commit('SET_BANKCARD_ADD_VISIBLE', visible);
        }, 2000);
        return false;
      }
      commit('SET_WITHDRAW_VISIBLE', visible);
    },
    logout({ commit, state }) {
      agentonlinecheck({ access_token: state.token, option: 2 });
      commit('SET_AGENT_USER_INFO', null);
      commit('SET_CURRENCY_SYMBOL', '');
      window.sessionStorage.removeItem('agentCode');
      Cookies.remove('agent_access_token');
      commit('SET_LOGIN', false);
      commit(
        'app/SET_HEADERS',
        {
          regionId: '',
          currencyId: '',
          isAgent: true,
        },
        { root: true },
      );
      return Promise.resolve();
    },
  },
  mutations: {
    SET_LOGIN(state, data) {
      state.isLogin = data;
    },
    SET_AGENT_USER_INFO(state, data) {
      state.userInfo = data;
    },
    SET_AGENT_REGISTER_VISIBLE(state, visible) {
      state.registerVisible = visible;
    },
    SET_AGENT_LOGIN_VISIBLE(state, visible) {
      state.loginVisible = visible;
    },
    SET_BANKCARD_ADD_VISIBLE(state, visible) {
      state.bankcardAddVisible = visible;
    },
    SET_CHANGE_PASSWORD_VISIBLE(state, visible) {
      state.changePasswordVisible = visible;
    },
    SET_CREATE_ACCOUNT_VISIBLE(state, visible) {
      state.createAccountVisible = visible;
    },
    SET_WITHDRAW_VISIBLE(state, visible) {
      state.withdrawVisible = visible;
    },
    SET_MEMBER_LEVEL_LIST(state, list) {
      state.memberLevelList = list;
    },
    SET_MEMBER_ACCOUNT_TYPE(state, payload) {
      state.memberAccountType = payload;
    },
    SET_COMMISSION_STATUS(state, payload) {
      state.commissionStatus = payload;
    },
    GET_BANK_LIST(state, payload) {
      state.bankList = payload;
    },
    GET_OMIT_STATUS_LIST(state, payload) {
      state.omitStatusList = payload;
    },
    GET_DEV_TYPE_LIST(state, payload) {
      state.devTypeList = payload;
    },
    SET_CURRENCY_SYMBOL(state, payload) {
      state.currencySymbol = payload;
    },
  },
});
