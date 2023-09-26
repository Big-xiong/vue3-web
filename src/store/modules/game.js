import { backtransall } from '@/api/center';
import {
  getAllGameCatesPlatforms,
  getPlatformGameIds,
  getPlatformGameIdsv2,
  getApiPlatformgameidsv3,
  backtrans,
  onlinecheck,
  open
} from '@/api/game';
import { allplatform as getAllPlatforms } from '@/api/dicts';

export default () => ({
  namespaced: true,
  state: {
    allPlatforms: {},
    gameCatePlatforms: [],
    gameCatesPlatforms: [],
    platformCateMap: {},
    platformCatesMap: {},
    platformGameIds: [],
    platformGameIdsv2: [],
    platformGameIdsv3: []
  },
  getters: {},
  actions: {
    backTransAll() {
      return backtransall({ LOADING: true });
    },
    async getAllGameCatePlatforms({ commit }) {
      const data = await getPlatformGameIdsv2();
      data.forEach((item) => {
        item.game_cate_name = item.name;
        item.platform_list = item.list_data;

        const platform = [];
        item.platform_list.forEach((listItem) => {
          const listData = { ...listItem };
          listData.game_platform_name = listItem.name;
          listData.game_platform_id = listItem.id;

          if (listItem.status !== 2) {
            platform.push(listData);
          }
        });
        item.platform_list = platform;
      });
      commit('SET_GAME_CATE_PLATFORMS', data);
    },
    getAllPlatforms({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAllPlatforms(params)
          .then((data) => {
            resolve(data);
            commit('SET_ALL_PLATFORMS', data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getAllGameCatesPlatforms({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('SET_GAMECATES_PLATFORMS', []);
        getAllGameCatesPlatforms(params)
          .then((data) => {
            data.map((item) => {
              try {
                item.game_cate_name = item.name.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
              } catch (e) {
                item.game_cate_name = item.name;
              }
              item.platform_list = item.list_data;
              const platform = [];
              item.platform_list.map((m, index) => {
                m.game_platform_name = m.name;
                m.game_platform_id = m.id;
                if (m.status !== 2) {
                  platform.push(m);
                }
              });
              item.platform_list = platform;
            });
            resolve(data);
            commit('SET_GAMECATES_PLATFORMS', data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getPlatformGameIds({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPlatformGameIds(params)
          .then((data) => {
            resolve(data);
            commit('SET_ALL_GAME_IDS', data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getPlatformGameIdsv2({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPlatformGameIdsv2(params)
          .then((data) => {
            resolve(data);
            commit('SET_ALL_GAME_IDS_V2', data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getPlatformGameIdsv3({ commit }, params) {
      return new Promise((resolve, reject) => {
        getApiPlatformgameidsv3(params)
          .then((data) => {
            resolve(data);
            commit('SET_ALL_GAME_IDS_V3', data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    gameOnlineCheck({ commit }, params) {
      return new Promise((resolve, reject) => {
        onlinecheck(params)
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    gameBacktrans({ commit }, params) {
      return new Promise((resolve, reject) => {
        backtrans(params)
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    gameMode({ commit }, params) {
      return new Promise((resolve, reject) => {
        open(params)
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  },
  mutations: {
    SET_GAME_CATE_PLATFORMS(state, data) {
      if (data) {
        state.gameCatePlatforms = data;
        const ret = {};
        data.forEach((item) => {
          ret[item.game_cate_id] = item;
        });
        state.platformCateMap = ret;
      } else {
        state.gameCatePlatforms = [];
        state.platformCateMap = {};
      }
    },
    SET_ALL_PLATFORMS(state, data) {
      if (data) {
        state.allPlatforms = data;
      } else {
        state.allPlatforms = {};
      }
    },
    SET_GAMECATES_PLATFORMS(state, data) {
      if (data) {
        state.gameCatesPlatforms = data;
        const ret = {};
        data.forEach((item) => {
          ret[item.game_cate_id] = item;
        });
        state.platformCatesMap = ret;
      } else {
        state.gameCatesPlatforms = [];
        state.platformCatesMap = {};
      }
    },
    SET_ALL_GAME_IDS(state, data) {
      if (data) {
        state.platformGameIds = data;
      } else {
        state.platformGameIds = [];
      }
    },
    SET_ALL_GAME_IDS_V2(state, data) {
      if (data) {
        state.platformGameIdsv2 = data;
      } else {
        state.platformGameIdsv2 = [];
      }
    },
    SET_ALL_GAME_IDS_V3(state, data) {
      if (data) {
        state.platformGameIdsv3 = data.reduce(
          (curr, next) => ((curr[next.game_cate_id] = next.list_data.filter((item) => item.page_type === 2)), curr),
          []
        );
        state.platformGameIdsv3.format = data.reduce((curr, next) => ((curr[next.game_cate_id] = next.list_data), curr), []);
        state.platformGameIdsv3.all = data;
      } else {
        state.platformGameIdsv3 = [];
      }
    },
    setState(state, { key, value }) {
      state[key] = value;
    }
  }
});
