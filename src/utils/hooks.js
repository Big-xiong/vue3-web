import {
  inject, onBeforeUnmount, onMounted, ref, watch, nextTick, reactive, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useStore } from 'vuex';
import { allbenefit } from '@/api/active';
import { memberlevellist } from '@/api/dicts';
import { allactivitybenefit, viptips } from '@/api/vip';
import { parseMoney } from '@/utils';
import { vipConfig } from '@/utils/config';

import {
  gamelist, hotgame, newgame, bonusgame, favoritelist,
} from '@/api/electron';

/**
 * @description: timeout定时器
 * @param {Function} fn 回调方法
 * @param {Number} time 执行间隔
 * @param {Object} options 配置项
 * @param {Boolean} options.manual 是否手动执行，默认false
 * @return {Function} 返回可终止定时器方法
 */
export const useTimeout = (fn, time, options = { manual: false }) => {
  let timer = null;
  const run = (...args) => {
    timer = setTimeout(() => fn.call(null, ...args), time);
  };
  if (!options.manual) run();
  const stop = () => clearTimeout(timer);
  onBeforeUnmount(stop);
  return {
    run,
    stop,
  };
};

/**
 * @description: interval定时器
 * @param {Function} fn 回调方法
 * @param {Number} time 执行间隔
 * @param {Object} options 配置项
 * @param {Boolean} options.manual 是否手动执行，默认false
 * @param {Boolean} options.immediate 是否初始执行，默认false
 * @return {Function} 返回可终止定时器方法
 */
export const useInterval = (fn, time, options = { manual: false, immediate: false }) => {
  if (options.immediate) fn.call(null);
  let timer = null;
  const running = ref(false);
  const run = (...args) => {
    running.value = true;
    timer = setInterval(() => fn.call(null, ...args), time);
  };
  if (!options.manual) run();
  const stop = () => {
    running.value = false;
    return clearInterval(timer);
  };
  onBeforeUnmount(stop);
  return {
    run,
    stop,
    running,
  };
};

export function useDicts(type, callback) {
  const $store = inject('store');
  const { dicts } = $store.state.app;
  if (!dicts[type]?.length && !dicts[`${type}Loading`]) {
    $store.dispatch('app/getDict', [type]);
  } else if (callback && dicts[type]) {
    callback(dicts[type]);
  }

  const stop = watch(dicts, () => {
    if (callback && dicts[type]) {
      callback(dicts[type]);
    }
  });

  onBeforeUnmount(stop);
}

export const usePagination = (
  callback,
  options = {
    page: 1,
    total: 1,
    size: 20,
    lastPage: 1,
  },
) => {
  const pagination = ref({
    page: 1,
    total: 10,
    size: 20,
    lastPage: 1,
    ...options,
  });

  function handlePageChange(page) {
    pagination.value.page = page;
    if (callback) {
      callback();
    }
  }

  return {
    pagination: pagination.value,
    handlePageChange,
  };
};

/**
 * @description: 返回refresh刷新变量，解决场景：语言切换、注册页select错误渲染
 * @param {Boolean} enterRefresh 是否进入刷新，默认true
 * @return {Object} 返回refresh状态值
 */
export function useRefresh(enterRefresh = true) {
  const refresh = ref(true);
  const updateRefresh = () => {
    refresh.value = false;
    nextTick(() => {
      refresh.value = true;
    });
  };
  onMounted(() => {
    if (enterRefresh) updateRefresh();
  });
  return {
    refresh,
    updateRefresh,
  };
}

/**
 * @description: 计算真人/电子页面右侧游戏列表item宽度
 * @param {String} baseWidth 单个item宽度
 * @param {String} space 单个item之间的间隔
 * @return {Object} 返回width及计算width方法
 */
export function useItemCalcWidth(baseWidth, space = 15) {
  const itemWidth = ref(`${baseWidth}px`);

  const itemCalcWidth = (e = window) => {
    const clientWidth = e.innerWidth ?? e.target.innerWidth;
    const calcWidth = clientWidth - (clientWidth - document.body.scrollWidth) - 128 - 278;
    const num = Math.ceil(calcWidth / baseWidth);
    const width = (calcWidth - num * space) / num;
    itemWidth.value = `${width}px`;
  };

  if (!import.meta.env.SSR) {
    (() => {
      const throttle = (type, name, obj) => {
        obj = obj || window;
        let running = false;
        const func = () => {
          if (running) {
            return;
          }
          running = true;
          requestAnimationFrame(() => {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
          });
        };
        obj.addEventListener(type, func);
      };

      /* init - you can init any event */
      throttle('resize', 'optimizedResize');
    })();

    // handle event
    window.addEventListener('optimizedResize', itemCalcWidth);
  }

  onMounted(() => {
    itemCalcWidth();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('optimizedResize', itemCalcWidth);
  });

  return {
    itemWidth,
    itemCalcWidth,
  };
}

export function getLang(lang) {
  if (lang.startsWith('en')) {
    return 'en';
  }
  if (lang.startsWith('vi') || lang === 'vn') {
    return 'vi';
  }
  if (lang.startsWith('th')) {
    return 'th';
  }
  return 'zh-CN';
}

/**
 * @description: 获取会员特权
 * param {Function} 回掉函数，返回四个特权的状态，true打勾
 */
export function usePrivilege(callback) {
  const store = inject('store');
  const { userInfo } = store.state.user;
  const benefitSetting = ref(null);
  const activitySetting = ref(null);
  const levelSetting = ref(null);
  const data = reactive({
    upgrade: false,
    birthday: false,
    rebate: false,
    exclusive: false,
  });

  useRequest(allbenefit, {
    manual: false,
    onSuccess(res) {
      const target = res?.data?.find((item) => item.title === 'dengjifuli' || item.title === '等级福利')?.benefit_setting ?? null;
      if (target) {
        try {
          benefitSetting.value = JSON.parse(target);
        } catch (e) {
          benefitSetting.value = [];
        }
      } else {
        benefitSetting.value = [];
      }
    },
  });

  useRequest(allactivitybenefit, {
    manual: false,
    onSuccess(res) {
      activitySetting.value = res;
    },
  });

  useRequest(memberlevellist, {
    manual: false,
    onSuccess(res) {
      levelSetting.value = res;
    },
  });

  watch(
    () => [levelSetting.value, activitySetting.value, benefitSetting.value],
    () => {
      if (levelSetting.value && activitySetting.value && benefitSetting.value) {
        const targetBenefit = benefitSetting.value.find((item) => item.level === userInfo?.level);
        if (targetBenefit) {
          data.upgrade = Number(targetBenefit.upgrade_money) > 0;
          data.birthday = Number(targetBenefit.birthday_money) > 0;
        }

        if (levelSetting.value[levelSetting.value.length - 1].level === userInfo?.level) {
          data.exclusive = true;
        }

        for (const item of activitySetting.value) {
          for (const subItem of item.list) {
            if (subItem.level === userInfo?.level && subItem.proportion > 0) {
              data.rebate = true;
              break;
            }
          }
          if (data.rebate) {
            break;
          }
        }

        callback?.(data, { levelSetting: levelSetting.value });
      }
    },
  );
}

export function useBannerLink(item, global) {
  const {
    h5_link: url, title, id, type,
  } = item;
  if (type === 23) {
    return global?.$router.push({
      name: 'euroCup',
      query: {
        id,
      },
    });
  }

  if (isNaN(Number(url))) {
    if (url.startsWith('http') || url.startsWith('//')) {
      window.open(url, 'thirdActivity');
    } else {
      global?.$router.push(url);
    }
  } else {
    global?.$router.push({
      path: '/promosDetail',
      query: {
        id: url,
      },
    });
  }
}

const ImgTypeMap = {
  SVG: 'image/svg+xml',
  ICO: 'image/x-icon',
  GIF: 'image/gif',
  PNG: 'image/png',
};

const subFavicon = import.meta.globEager('/src/current_project/assets/favico.ico');
const favicon = Object.values(subFavicon)?.[0]?.default;
export const useFavicon = (href = favicon || '/favicon.ico') => {
  if (!href) return;

  const cutUrl = href.split('.');
  const imgSuffix = cutUrl[cutUrl.length - 1].toLocaleUpperCase();

  const link = document.querySelector('link[rel*=\'icon\']') || document.createElement('link');

  link.type = ImgTypeMap[imgSuffix];
  link.href = href;
  link.rel = 'shortcut icon';

  document.getElementsByTagName('head')[0].appendChild(link);
};

/**
 * 处理电子页面查询游戏逻辑
 */
export const useSlotGameSearch = (data, searchVal, isScrollLoad) => {
  const getGame = (isSearch = false) => {
    if (data.gameListLoading) return;
    data.gameListLoading = true;
    if (isSearch) {
      data.gameList = [];
      data.currentPage = 1;
    }
    if (data.electronType) {
      data.activePlat = data.electronType;
    }

    const obj = {
      game_cate_id: data.cateID,
      platform_id: data.platList[data.activePlat].id ?? data.platList.map((item) => item.id).join(',').slice(1),
      is_payfor: data.activeLine ?? undefined,
      name: searchVal.value ?? undefined,
      sub_game_cate_id: data.activeSon ?? undefined,
      page: data.currentPage,
    };

    const config = {
      0: gamelist,
      1: hotgame,
      2: newgame,
      3: bonusgame,
      other: favoritelist,
    };

    const fn = config[data.activeNav] ?? config.other;
    fn(obj).then((res) => {
      data.total = res.last_page;
      if (Array.isArray(res)) {
        data.gameList = res;
      } else {
        res.data.forEach((item) => {
          item.default_game_id = item.id;
        });
        if (isScrollLoad && data.gameList.length) {
          data.gameList = data.gameList.concat(res.data);
        } else {
          data.gameList = res.data;
        }
      }
      data.noMore = res.current_page === res.last_page;
      data.gameListLoading = false;
    });
  };

  return {
    getGame,
  };
};

/**
 * @description: pc端内页匹配v3接口数据
 * @param {Array} navArr 内页游戏数组，视图数据模型
 * @param {Array} platformgameidsv3 接口返回后台游戏配置数组 page_type：2 为内页配置
 * @return {Array} navArr与platformgameidsv3的交集，通过rel_key匹配
 */
export const useMatchV3GameList = (navArr, platformgameidsv3) => {
  let flatV3GamesArr = [];
  platformgameidsv3.map((cate) => {
    flatV3GamesArr.push(...cate.list_data);
  });
  flatV3GamesArr = flatV3GamesArr.filter((game) => game.page_type === 2);
  let results = navArr.filter((nav) => flatV3GamesArr.some((game) => game.rel_key === nav.relKey));
  // 使用接口返回的default_game_id、platform_id和配图imgs
  results = results.map((result) => ({
    ...result,
    default_game_id: flatV3GamesArr.find((game) => game.rel_key === result.relKey)?.default_game_id,
    platform_id: flatV3GamesArr.find((game) => game.rel_key === result.relKey)?.platform_id,
    imgs: flatV3GamesArr.find((game) => game.rel_key === result.relKey)?.imgs,
  }));
  return results;
};

/**
 * @description: 获取指定游戏列表
 * @param {String} cateId 游戏分类
 * @param {String} pageType 游戏展示类型，默认2为内页
 * @return {Object}
 */
const cateIdConfig = {
  real: 1,
  slot: 2,
  fishing: 3,
  sport: 4,
  lottery: 5,
  chess: 7,
  esport: 8,
};
export const useInnerGameList = (cateId, pageType = 2) => {
  const $store = useStore();
  const route = useRoute();
  const { game } = $store.state;
  cateId = cateId || cateIdConfig[route.name];

  const active = ref(0);
  const gameList = computed(() => game.platformGameIdsv3?.format?.[cateId]?.filter?.((item) => item.page_type === pageType) ?? []);

  const targetItem = computed(() => gameList.value[active.value]);
  const targetImgs = computed(() => targetItem.value?.imgs ?? []);

  return {
    active,
    gameList,
    targetItem,
    targetImgs,
    currentCateId: cateId,
    updateActive: (index) => active.value = index,
  };
};

// 需要走viptips接口的数据项
const configItems = ['birthday_money', 'upgrade_money', 'month_money', 'gift'];
// 转换显示内容
const vipValueParse = {
  // 有: '✓',
  // 无: '-',
};
export const useVipDataList = () => {
  const $store = useStore();
  const vipList = ref(vipConfig);
  const questionList = ref([]);
  const keys = vipConfig.map((item) => item.key).filter(Boolean).filter((key) => !configItems.includes(key));

  watch(() => $store.state.app.dicts.memberlevellist, (list) => {
    list?.forEach?.((item) => {
      keys.forEach((k) => {
        const target = vipList.value.find((child) => child.key === k);
        if (target) target[`lv${item.level}`] = item[k] && k !== 'withdraw_times_limit' ? parseMoney(item[k]) : item[k];
      });
    });
  }, { immediate: true });

  useRequest(viptips, {
    onSuccess(res) {
      const idx = res.wash_activity?.findIndex((item) => item.washcode_content);
      if (idx > -1) {
        // 温馨提示获取规则：1.那个有数据取那个 2.全都有数据取第一个
        const warmTips = res.wash_activity?.[idx].washcode_content || '';
        questionList.value = warmTips.replace(/<[^<>]+>/g, '%%%').split('%%%').filter((el) => el && (el !== '\n')); // 正则匹配后台配置富文本内html内容
        questionList.value = questionList.value.map((str) => {
          const htmlDoc = new DOMParser().parseFromString(str, 'text/html'); // html反转义
          return htmlDoc.documentElement.textContent;
        });
      }

      res?.birthday?.forEach?.((item) => {
        configItems.forEach((targetKey) => {
          const index = vipList.value.findIndex(({ key }) => key === targetKey);
          const value = index > -1 ? item[targetKey] ?? 0 : 0;
          vipList.value[index][`lv${item.level}`] = vipValueParse[value] ?? parseMoney(value);
        });
      });
    },
  });

  return {
    vipList,
    questionList,
  };
};
