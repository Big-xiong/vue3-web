<template>
  <div class="real">
    <!-- <Banner :src="bannerUrl" /> -->
    <SubBanner id="1" />
    <Nav
      :title="`${title}${$t(' 个游戏')}`"
      active-tab="1"
      :tabs="tabs"
      @onQuery="onQuery"
      @onTabsChange="onTabsChange"
    />
    <div class="real-main align-center-wrap">
      <div class="real-main-left">
        <Menu
          :menu-list="menuList"
          @onFilter="onFilter"
          @onCheck="onCheck"
        />
      </div>
      <div
        class="real-main-right"
        v-loading="data.gameListLoading && !data.gameList.length"
      >
        <Table
          v-if="data.isFixedData"
          :width="itemWidth"
          :nav-index="data.activeNav"
          :list="data.defaultGameList"
          @onItemLike="onItemLike"
          :plat="menuList[0]?.list"
        />
        <Table
          v-else
          :width="itemWidth"
          :nav-index="data.activeNav"
          :list="data.gameList"
          v-infinite-scroll="load"
          @onItemLike="onItemLike"
          :plat="menuList[0]?.list"
        />
        <div
          class="real-main-empty"
          v-if="data.nodata && !data.gameListLoading"
        >
          <img
            src="/src/assets/images/empty.png"
            alt
          />
          <p>{{ $t(`暂无搜索内容`) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref, reactive, watch, inject, onMounted, computed, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { subgamecate } from '@/api/game';
import {
  gamelist, hotgame, newgame, bonusgame, favoritelist, favorite,
} from '@/api/electron';
import { useItemCalcWidth, useInterval } from '@/utils/hooks';
import Banner from '@/components/Banner/index.vue';
import Nav from '@/components/Nav/index.vue';
import Menu from '@/components/Menu/index.vue';
import Table from './components/Table.vue';
import SubBanner from '@/components/Banner/sub.vue';

const global = inject('global');
const bannerUrl = '/src/assets/images/real/banner.png';
const title = ref(5);
const sub_game_cate_id = ref('');
const platform_id = ref('');
const menuList = reactive([
  {
    title: global.$t(`平台`),
    list: [],
  },
  {
    title: global.$t(`游戏类型`),
    list: [],
  },
]);
const data = reactive({
  lineList: [],
  activeNav: 1,
  activePlat: 0,
  activeLine: 0,
  cateID: 0, // 游戏cateID
  sonList: [], // 二级分类
  activeSon: 0, // 激活二级分类
  currentPage: 1, // 当前页
  gameList: [], // 游戏列表
  defaultGameList: [
    {
      pic: '/src/assets/images/real/ag.png',
      default_game_id: 1,
      game_platform_id: 1,
      name: 'AG',
      desc: global.$t('互动多合一 快感加倍百家乐、炸金花、骰宝等多款游戏'),
      title: global.$t('AG平台'),
      is_favorite: -1,
    },
    {
      pic: '/src/assets/images/real/n2live.png',
      default_game_id: 9702,
      game_platform_id: 140,
      name: 'N2LIVE',
      desc: global.$t('最具影响力真人平台'),
      title: global.$t('N2LIVE平台'),
      is_favorite: -1,
    },
    {
      pic: '/src/assets/images/real/sexy.png',
      default_game_id: 9674,
      game_platform_id: 138,
      name: 'SEXY',
      desc: global.$t('贴近亚洲文化市场'),
      title: global.$t('SEXY平台'),
      is_favorite: -1,
    },
    {
      pic: '/src/assets/images/real/gdg.png',
      default_game_id: 9697,
      game_platform_id: 139,
      name: 'GDG',
      desc: global.$t('最具影响力真人平台'),
      title: global.$t('GDG平台'),
      is_favorite: -1,
    },
    {
      pic: '/src/assets/images/real/sa.png',
      default_game_id: 9673,
      game_platform_id: 137,
      name: 'SA',
      desc: global.$t('最具影响力真人平台'),
      title: global.$t('SA平台'),
      is_favorite: -1,
    },
  ], // 游戏列表
  isMore: true, // 是否有更多
  total: 1, // 总页数
  gameListLoading: false, // 游戏列表加载状态
  nodata: false,
  isFixedData: true,
});

const $store = inject('store');
const { user } = $store.state;
const { dicts } = $store.state.app;

const {
  itemWidth,
} = useItemCalcWidth(330, 23);

onMounted(() => {
  $store.dispatch('app/getDict', ['platformgameidsv2']);
  watch(() => dicts.platformgameidsv2, () => {
    const { list_data } = dicts.platformgameidsv2?.find((item) => item.game_cate_id === 1) ?? {};
    if (list_data?.length) {
      data.defaultGameList = data.defaultGameList.filter((item) => list_data.find((child) => child.name === item.name)?.status === 1);
    }

    const arr = list_data;
    list_data?.forEach((item, i) => {
      menuList[0].list[i] = { ...item, checked: false };
    });
  }, { immediate: true });
});

const tabs = {
  label: global.$t(`排序方式`),
  items: [
    { label: global.$t(`全部游戏`), name: '1' },
    { label: global.$t(`热门游戏`), name: '2' },
    { label: global.$t(`最新游戏`), name: '3' },
    { label: global.$t(`累计奖金池`), name: '4' },
    { label: global.$t(`我的收藏`), name: '5' },
  ],
};

const searchVal = ref('');
const isEmpty = computed(() => !data.gameList.length && !data.gameListLoading);

watch([sub_game_cate_id, platform_id, searchVal], (res) => {
  if (data.activeNav === 1) {
    if (res[0] || res[1] || res[2]) {
      data.isFixedData = false;
    } else {
      data.isFixedData = true;
    }
  }
});

// 游戏列表
function getGame(isSearch = false) {
  if (isSearch) {
    data.gameList = [];
    data.currentPage = 1;
  }
  const obj = {
    game_cate_id: 1,
    platform_id: platform_id.value ?? undefined,
    name: searchVal.value ?? undefined,
    sub_game_cate_id: sub_game_cate_id.value ?? undefined,
    page: data.currentPage,
    t: new Date().getTime(),
  };

  const config = {
    1: gamelist,
    2: hotgame,
    3: newgame,
    4: bonusgame,
    other: favoritelist,
  };
  data.gameListLoading = true;
  const fn = config[data.activeNav] ?? config.other;
  return fn(obj).then((res) => {
    data.total = res.last_page;
    if (Array.isArray(res)) {
      data.gameList = res;
    } else {
      res?.data?.forEach?.((item) => {
        item.default_game_id = item.id;
      });
      data.gameList = data.gameList.concat(res.data);
    }
    // data.nodata = !data.gameList.length;
    data.isMore = res.per_page === res.data.length;
    title.value = res.total;
    data.gameListLoading = false;
  });
}

useRequest(() => subgamecate({ game_cate_id: 1 }), {
  onSuccess(res) {
    res?.forEach?.((item, i) => {
      menuList[1].list[i] = { ...item, checked: false };
    });
  },
});

// await getGame();

function load() {
  if (data.gameListLoading || !data.isMore || data.isFixedData) return;
  data.currentPage += 1;
  getGame();
}

function onTabsChange(index) {
  data.activeNav = index;
  data.nodata = false;
  if (!platform_id.value && !sub_game_cate_id.value) {
    if (index === 1) {
      data.isFixedData = true;
    } else {
      data.isFixedData = false;
      data.gameList = [];
      data.currentPage = 1;
      getGame();
    }
  } else {
    data.isFixedData = false;
    data.gameList = [];
    data.currentPage = 1;
    getGame();
  }
}
function onQuery(e) {
  searchVal.value = e;
  data.gameList = [];
  data.currentPage = 1;
  getGame(true);
}
function onSwitchChange(e) {
}
function onCheck(arr) {
  platform_id.value = arr[0] && arr[0].length ? arr[0].toString() : '';
  sub_game_cate_id.value = arr[1] && arr[1].length ? arr[1].toString() : '';
  data.gameList = [];
  data.currentPage = 1;
  getGame();
}
function onFilter(arr) {
  platform_id.value = '';
  sub_game_cate_id.value = '';
  data.gameList = [];
  data.currentPage = 1;
  getGame();
}

const num = ref(0);
const { run: runInterval, stop: stopInterval } = useInterval(() => {
  num.value += 1;
  console.log(num.value);
  if (num.value === 20) {
    stopInterval();
    num.value = 0;
  }
}, 50, { manual: true });
// 收藏游戏
function likeGame(id, like) {
  if (!user?.isLogin) {
    global.$message.warning(global.$t('请登录后，点击收藏'));
    return;
  }
  favorite({ game_id: id }).then((res) => {
    if (res) {
      if (data.activeNav === 5) {
        const index = data.gameList.findIndex((item) => item.id === id);
        data.gameList.splice(index, 1);
        return;
      }
      if (like === 2) {
        global.$message.success(global.$t('收藏成功'));
      } else {
        global.$message.success(global.$t('取消收藏成功'));
      }
    }
  });
}
function onItemLike(id, like) {
  likeGame(id, like);
}

onMounted(() => {
  watchEffect(() => {
    if (!data.isFixedData) {
      data.nodata = !data.gameList.length;
    }
  });
});
</script>

<style lang="scss">
.real {
  &-main {
    display: flex;
    justify-content: space-between;
    &-left {
      width: 270px;
      margin-right: 8px;
    }
    &-right {
      flex: 1;
      padding: 23px 0;
      overflow: hidden;
    }

    &-empty {
      text-align: center;
      padding-top: 100px;

      img {
        width: 126px;
      }

      p {
        font-size: 20px;
        color: var(--font-color-404040);
        margin: 20px 0;
      }
    }
  }
}
</style>
