<template>
  <div class="electronic">
    <!-- <Banner :src="bannerUrl"/> -->
    <SubBanner id="2" />
    <Nav
      :title="`${title}${$t(' 个游戏')}`"
      :mode="1"
      active-tab="1"
      :tabs="tabs"
      @onQuery="onQuery"
      @keyup="onKeyup"
      @onTabsChange="onTabsChange"
      @onSwitchChange="onSwitchChange"
    />
    <div class="electronic-main align-center-wrap">
      <div class="electronic-main-left">
        <Menu :menu-list="menuList" @onFilter="onFilter" @onCheck="onCheck" />
      </div>
      <div class="electronic-main-right" v-loading="data.gameListLoading">
        <transition :key="updateKey" name="fade" mode="out-in" appear>
          <component
            :is="view.component"
            :nav-index="data.activeNav"
            :list="data.gameList"
            v-infinite-scroll="load"
            :allplatform="dicts?.allplatform"
            @onItemLike="onItemLike"
          />
        </transition>
        <div class="electronic-main-empty" v-if="isEmpty">
          <!-- <img
            src="/src/assets/images/empty.png"
            alt
          />-->
          <svg-icon class="svg-icon-empty" name="empty" />
          <p>{{ $t(`暂无搜索内容`) }}</p>
        </div>
        <!-- <Table :list="list" @onItemLike="onItemLike" /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  shallowRef, watch, ref, reactive, inject, computed, onMounted, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { useTimeout } from '@/utils/hooks';
import {
  getpayforline, gamelist, hotgame, newgame, bonusgame, favoritelist, favorite,
} from '@/api/electron';
import Banner from '@/components/Banner/index.vue';
import Nav from '@/components/Nav/index.vue';
import Menu from '@/components/Menu/index.vue';
import Table from './components/Table.vue';
import List from './components/List.vue';
import SubBanner from '@/components/Banner/sub.vue';

const global = inject('global');

const bannerUrl = '/src/assets/images/electronic/banner.png';

const title = ref('loading');
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

const menuList = reactive([
  {
    title: global.$t(`平台`),
    list: [],
  },
  {
    title: global.$t(`赔付线`),
    list: [],
  },
]);

const config = {
  1: Table,
  2: List,
};

const view = shallowRef({
  component: Table,
});

const data = reactive({
  platform_id: '',
  lineList: [],
  navList: [
    global.$t('全部游戏'),
    global.$t('热门游戏'),
    global.$t('最新游戏'),
    global.$t('累计奖金池'),
    global.$t('我的收藏'),
  ],
  activeNav: 1,
  activePlat: 0,
  activeLine: 0,
  cateID: 0, // 游戏cateID
  sonList: [], // 二级分类
  activeSon: 0, // 激活二级分类
  currentPage: 1, // 当前页
  gameList: [], // 游戏列表
  isMore: true, // 是否有更多
  total: 1, // 总页数
  gameListLoading: true, // 游戏列表加载状态
  nodata: false,
});

const $store = inject('store');
const { app, user } = $store.state;
const { dicts } = app;
const $router = useRouter();

const searchVal = ref('');

const { loading: getPayForLineLoading } = useRequest(getpayforline, {
  onSuccess(res) {
    if (res) {
      // data.lineList = [global.$t('全部'), ...Object.values(res)];
      menuList[1].list = [{ name: global.$t(`全部`), id: 0, checked: false }, ...Object.keys(res)?.map?.((item) => ({ name: res[item], id: item, checked: false }))];
    }
  },
});

// 游戏列表
function getGame(isSearch = false, searchValue = '') {
  if (isSearch) {
    data.gameList = [];
    data.currentPage = 1;
  }
  const obj = {
    game_cate_id: data.cateID,
    platform_id: data.platform_id ?? undefined,
    is_payfor: data.activeLine ?? undefined,
    name: searchValue ?? undefined,
    sub_game_cate_id: data.activeSon ?? undefined,
    page: data.currentPage,
    t: new Date().getTime(),
  };
  const params = {
    1: gamelist,
    2: hotgame,
    3: newgame,
    4: bonusgame,
    other: favoritelist,
  };
  // console.log(data.activeNav, 'active');
  data.gameListLoading = true;
  const fn = params[data.activeNav] ?? params.other;
  return fn(obj).then((res) => {
    data.total = res.last_page;
    if (Array.isArray(res)) {
      data.gameList = res;
    } else {
      res?.data?.forEach?.((item) => {
        item.default_game_id = item.id;
      });
      data.gameList = data?.gameList?.concat?.(res.data) ?? [];
    }
    data.isMore = res.per_page === res.data.length;
    data.nodata = !data.gameList.length;
    title.value = res.total;
    data.gameListLoading = false;
  });
}

const { run: searchGame } = useRequest(gamelist, {
  manual: true,
  debounceInterval: 500,
  onSuccess(res) {
    if (res) {
      data.total = res.last_page;
      if (Array.isArray(res)) {
        data.gameList = res;
      } else {
        res?.data?.forEach?.((item) => {
          item.default_game_id = item.id;
        });
        data.gameList = data?.gameList?.concat?.(res.data) ?? [];
      }
      data.isMore = res.per_page !== 1;
      data.nodata = !data.gameList.length;
      title.value = res.total;
    }
  },
});

const isEmpty = computed(() => !data.gameList.length && !data.gameListLoading);

const platId = ref(null);
onMounted(() => {
  $store.dispatch('app/getDict', ['allplatform', 'platformgameidsv2']);

  const platformWatch = watch(() => dicts, () => {
    const { game_cate_id, list_data } = dicts.platformgameidsv2?.find((item) => item.game_cate_id === 2) ?? {};
    if (game_cate_id) {
      platformWatch();
      const listData = list_data.filter((item) => item.status === 1);
      listData?.forEach((item, i) => {
        menuList[0].list[i] = { ...item, checked: false };
      });
      menuList[0].list.unshift({ name: global.$t(`全部`), id: 0, checked: false });
      menuList[0]?.list.forEach((item) => {
        if (item.name === platId.value) {
          data.platform_id = item.id;
          item.checked = true;
        }
      });
      data.cateID = game_cate_id;
      getGame();
    }
  }, { deep: true });

  watch($router.currentRoute, (val) => {
    if (val.query.id) {
      platId.value = val.query.id;
      if (menuList[0].list.length) {
        menuList[0]?.list.forEach((item) => {
          item.checked = false;
          if (item.name === platId.value) {
            item.checked = true;
            data.platform_id = item.id;
          }
        });
        resetField();
        getGame();
      }
    }
  }, { immediate: true });
});

function load() {
  if (data.gameListLoading || !data.isMore) return;
  data.currentPage += 1;
  getGame();
}

function resetField() {
  data.gameList = [];
  data.currentPage = 1;
}

function onTabsChange(index) {
  data.activeNav = index;
  resetField();
  getGame();
}
function onQuery(e) {
  resetField();
  getGame(true, e);
}

const searchValue = ref('');
const { run: timeoutRun } = useTimeout(() => {
  getGame(true, searchValue.value);
}, 500, { manual: true });
function onKeyup(e) {
  resetField();
  searchValue.value = e.target.value;
  // timeoutRun();
  searchGame({
    game_cate_id: data.cateID,
    platform_id: data.platform_id ?? undefined,
    is_payfor: data.activeLine ?? undefined,
    name: searchValue.value ?? undefined,
    sub_game_cate_id: data.activeSon ?? undefined,
    page: data.currentPage,
    t: new Date().getTime(),
  });
}

const updateKey = ref(0);

function onSwitchChange(index) {
  updateKey.value = index;
  view.value.component = config[index];
}
function onCheck(arr) {
  data.platform_id = arr[0]?.toString() ?? '';
  data.activeLine = arr[1]?.toString() ?? '';
  resetField();
  getGame();
}

function onFilter(arr) {
  data.platform_id = '';
  data.activeLine = '';
  resetField();
  getGame();
}

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
      if (like === 1) {
        global.$message.success(global.$t('收藏成功'));
      } else {
        global.$message.success(global.$t('取消收藏成功'));
      }
    }
  });
}
function onItemLike(id, like) {
  // console.log('onItemLike', id, like);
  // 更新数据
  data.gameList.forEach((item) => {
    if (item.id === id) {
      item.is_favorite = like;
    }
  });
  likeGame(id, like);
}

function sliderChange(item) {
  // console.log('sliderChange', item)
}

</script>

<style lang="scss">
.electronic {
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
      justify-content: flex-end;
      flex-direction: column;
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
      .svg-icon-empty {
        width: 100px;
        height: 100px;
        fill: var(--theme-color) !important;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
