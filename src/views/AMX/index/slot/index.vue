<template>
  <div class="electron-wrap"
    :style="{ 'background-image': `url(${$getSrc('/src/current_project/assets/images/image_banner_bk.png')})` }">
    <SubBanner id="2" />
    <div class="main-center-wrap">
      <Moneypot />
      <div class="electron-wrap-choose">
        <div class="layout-flex-between electron-wrap-choose-top">
          <el-tabs v-model="data.activeNav" :before-leave="chooseNav">
            <el-tab-pane v-for="(item, index) in data.navList" :key="index" :label="item" :name="index"></el-tab-pane>
          </el-tabs>
          <div class="layout-flex-center electron-wrap-choose-search">
            <el-input v-model="searchVal" :placeholder="$t('请输入游戏名称')" prefix-icon="el-icon-search"
              @keyup.enter="getGame(true)" />
            <el-button type="primary" @click="getGame(true)">{{ $t('搜索') }}</el-button>
          </div>
        </div>

        <div v-if="data.activeNav != 4" class="other">
          <ul v-loading="dicts.platformgameidsv2Loading" element-loading-spinner="el-icon-loading">
            <li>{{ $t('游戏平台') }}：</li>
            <li v-for="(item, index) in data.platList" :key="index" :class="data.activePlat === index ? 'active' : ''"
              @click="choosePlat(index)">{{ item.name ?? item.code?.toUpperCase?.() }}</li>
          </ul>

          <ul v-loading="getPayForLineLoading" element-loading-spinner="el-icon-loading">
            <li>{{ $t('游戏线路') }}：</li>
            <li v-for="(item, index) in data.lineList" :key="index" :class="data.activeLine === index ? 'active' : ''"
              @click="chooseLine(index)">{{ item }}</li>
          </ul>
        </div>
      </div>
      <div class="electron-wrap-game">
        <div v-for="(item, index) in data.gameList" :key="index">
          <!-- <img
            :src="item.pic"
            alt
          /> -->
          <el-image :src="item.pic" mode="cover" class="small"> </el-image>
          <div class="shadow">
            <el-button type="primary" v-login @click="$playGame(item)">{{ user?.isLogin ? $t('立即游戏') : $t('立即投注') }}
            </el-button>
          </div>
          <div class="layout-flex-between bottom">
            <p>
              <label>{{ getPlatformName(item.game_platform_id) }}</label>
              {{ item.name }}
            </p>
            <svg-icon v-if="item.is_favorite === 1 || data.activeNav === 4" name="love-active" class="active" v-login
              @click="likeGame(item.id, index, 'r')" />
            <svg-icon v-else name="love-normal" v-login @click="likeGame(item.id, index, 'g')" />
          </div>
        </div>
      </div>
      <div v-show="isEmpty" class="electron-wrap-none">
        <svg-icon class="svg-icon-empty" name="empty" />
        <!-- <img :src="$getSrc('/src/current_project/assets/images/electron/empty.png')" alt /> -->
        <p>{{ $t('未搜到相关游戏') }}</p>
        <p v-show="searchVal">{{ $t('请尝试更换条件查询') }}</p>
      </div>
      <div ref="moreRef" v-show="!data.noMore" class="layout-flex-center electron-wrap-loading">
        <!-- <img
          :src="$getSrc('/src/current_project/assets/images/electron/loading.png')"
          alt
        /> -->
        <svg-icon name="loading@1x" />
        <p>{{ $t('加载中') }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  inject, reactive, computed, watch, ref, watchEffect, onMounted,
} from 'vue';
import { useInViewport, useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getpayforline, allgamesubcate, gamelist, hotgame, newgame, bonusgame, favoritelist, favorite,
} from '@/api/electron';
import SubBanner from '@/components/Banner/sub.vue';
import Moneypot from './components/Moneypot.vue';

const global = inject('global');
const $route = useRoute();
const data = reactive({
  platList: [],
  lineList: [],
  navList: [
    global.$t('全部游戏'),
    global.$t('热门游戏'),
    global.$t('最新游戏'),
    global.$t('累计奖金池'),
    global.$t('我的收藏'),
  ],
  electronType: '',
  activeNav: 0,
  activePlat: 0,
  activeLine: 0,
  cateID: 0, // 游戏cateID
  sonList: [], // 二级分类
  activeSon: 0, // 激活二级分类
  currentPage: 1, // 当前页
  gameList: [], // 游戏列表
  noMore: false, // 是否有更多
  total: 1, // 总页数
  gameListLoading: false, // 游戏列表加载状态
});

const $store = inject('store');
const { user } = $store.state;
$store.dispatch('app/getDict', ['allplatform']);
const { dicts } = $store.state.app;
const searchVal = ref('');
const moreRef = ref(null);
const isInViewport = useInViewport(moreRef);
const isEmpty = computed(() => !data.gameList.length && !data.gameListLoading);
const platformgameidsv3 = computed(() => $store.state.game?.platformGameIdsv3?.all);

watch(isInViewport, () => {
  if (isInViewport.value && data.cateID) {
    data.currentPage += 1;
    getGame();
  }
});

const { run: allGamesUbcateRun, loading: allGamesUbcateLoading } = useRequest(allgamesubcate, {
  manual: true,
  onSuccess(res) {
    data.sonList = [global.$t('全部'), ...res];
  },
});

const { loading: getPayForLineLoading } = useRequest(getpayforline, {
  onSuccess(res) {
    data.lineList = [global.$t('全部'), ...Object.values(res)];
  },
});

watch(() => platformgameidsv3.value, () => {
  const { game_cate_id, list_data } = platformgameidsv3.value?.find((item) => item.game_cate_id === 2) ?? {};
  if (game_cate_id) {
    const list = list_data.filter((item) => item.status === 1 && item.page_type === 2);
    data.platList = [{ name: global.$t('全部') }, ...list];
    data.cateID = game_cate_id;
    if ($route.query.electronType && !data.electronType) {
      data.electronType = data.platList.findIndex((item) => item.code === $route.query.electronType);
    }
    allGamesUbcateRun({ pid: game_cate_id });
    getGame();
  }
}, { immediate: true });

function getPlatformName(id) {
  return dicts.allplatform?.[id] ?? '';
}

// 游戏列表
function getGame(isSearch = false) {
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
    platform_id: data.platList[data.activePlat].id ?? undefined,
    is_payfor: data.activeLine ?? undefined,
    name: searchVal.value ?? undefined,
    sub_game_cate_id: data.activeSon ?? undefined,
    page: data.currentPage,
  };

  if (data.activePlat === 0) {
    obj.platform_id = data.platList
      .map((item) => String(item?.id ?? '')).filter((item) => item).join(',');
  }

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
      data.gameList = data.gameList.concat(res.data);
    }
    data.noMore = res.current_page === res.last_page;
    data.gameListLoading = false;
  });
}

function chooseNav(index) {
  if (index === 4) {
    if (!user.isLogin) {
      global.$dialog({ tpl: 'GamePop' });
      return false;
    }
  }
  data.activeNav = index;
  data.gameList = [];
  data.currentPage = 1;
  data.activePlat = 0;
  data.activeLine = 0;
  data.activeSon = 0;
  data.electronType = '';
  getGame();
}

function choosePlat(index) {
  data.activePlat = index;
  data.gameList = [];
  data.currentPage = 1;
  data.electronType = '';
  getGame();
}
// 选择平台
function chooseLine(index) {
  data.activeLine = index;
  data.gameList = [];
  data.currentPage = 1;
  data.electronType = '';
  getGame();
}
// 收藏游戏
function likeGame(id, index, type) {
  favorite({ game_id: id }).then((res) => {
    if (res) {
      if (data.activeNav === 4) {
        data.gameList.splice(index, 1);
      }
      if (type === 'g') {
        global.$message.success(global.$t('收藏成功'));
        data.gameList[index].is_favorite = 1;
      } else {
        global.$message.success(global.$t('取消收藏成功'));
        data.gameList[index].is_favorite = 2;
      }
    }
  });
}
</script>
<style lang="scss" scoped>
/* stylelint-disable */
.electron-wrap {
  min-height: 40vh;
  padding-bottom: 80px;
  background-size: 100% auto;
  background-position: 0 0;

  &-choose {
    background-color: var(--bg-color-282828);
    margin: 40px 0 20px;
    border-radius: 4px;
    border: 1px solid var(--border-color-000-1);

    &-top {
      height: 75px;
      border-bottom: 1px solid var(--border-color-fff-1);
      padding: 0 20px 0 25px;

      :deep(.el-tabs__header) {
        margin: 0;

        .el-tabs__nav-wrap {
          &::after {
            content: none;
          }
        }

        .el-tabs__item.is-top {
          padding: 0 15px !important;
          color: var(--font-color-fff-4);
          font-size: 18px;
          height: 75px;
          box-sizing: border-box;
          line-height: 75px;

          &.is-active {
            color: var(--theme-color);
          }
        }
      }
    }

    &-search {
      width: 300px;
      height: 46px;
      margin: 15px 0;

      .el-input {
        width: 210px;
        height: 46px;
        line-height: 46px;

        :deep(.el-input__inner) {
          background-color: var(--input-bg-color-191919) !important;
          border: none;
          height: 46px;
          border-radius: 4px 0 0 4px !important;

          // &:-moz-placeholder {
          //   color: var(--slot-font-ipt-color) !important;
          // }

          // &::-moz-placeholder {
          //   color: var(--slot-font-ipt-color) !important;
          // }

          // &:-ms-input-placeholder {
          //   color: var(--slot-font-ipt-color) !important;
          // }

          // &::-webkit-input-placeholder {
          //   color: var(--slot-font-ipt-color) !important;
          // }
        }

        :deep(.el-input__prefix) {
          color: var(--font-color-525152);
        }
      }

      .el-button {
        min-width: 90px;
        border-radius: 0 4px 4px 0 !important;
        font-weight: normal;
      }
    }

    >.other {
      padding: 10px 40px 30px;

      >ul {
        line-height: 30px;
        margin-top: 15px;
        color: var(--font-color-ccc);
        overflow: hidden;
        font-size: 16px;

        li {
          color: var(--font-color-fff-6);

          &:not(:first-child) {
            padding: 0 14px;
            border-radius: 4px;
            margin-right: 15px;
            border: 1px solid var(--border-color-bbb);
            float: left;
            cursor: pointer;

            &.active {
              border-color: var(--theme-color);
              color: var(--theme-color);
            }
          }

          &:first-child {
            margin-right: 22px;
            float: left;
          }
        }
      }
    }
  }

  &-game {
    min-height: 100px;
    text-align: left;

    >div {
      position: relative;
      width: 230px;
      height: 230px;
      margin-right: 12px;
      margin-top: 13px;
      display: inline-block;
      vertical-align: top;
      border-radius: 6px;
      overflow: hidden;

      &:nth-child(5n + 5) {
        margin-right: 0;
      }

      >.el-image {
        display: block;
        width: 100%;
        height: 172px;
      }

      >.shadow {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 58px;
        left: 0;
        display: none;
        background-color: var(--bg-color-00008);

        .el-button {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 120px;
          font-weight: normal;
          transform: translate3d(-50%, -50%, 0);
          font-size: 14px;
          height: 38px;
          border-radius: 6px !important;

          &:hover {
            opacity: 1;
          }
        }
      }

      &:hover {
        >.shadow {
          display: block;
        }
      }

      >.bottom {
        background-color: var(--bg-color-282828);
        height: 58px;
        font-size: 16px;
        color: var(--font-color-000);
        padding: 0 20px;
        box-sizing: border-box;

        >p {
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        >.svg-icon {
          width: 22px;
          height: 18px;
          cursor: pointer;
          fill: var(--border-color-979797);

          &.active {
            fill: var(--theme-color) !important;
          }
        }
      }
    }
  }

  &-none {
    margin-top: 80px;

    >img {
      display: block;
      width: 77px;
      height: 82px;
      margin: 0 auto 26px;
    }

    p {
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      color: var(--border-color-525152);
    }

    .svg-icon-empty {
      width: 100px;
      height: 100px;
      fill: var(--theme-color) !important;
    }
  }

  &-loading {
    margin-top: 40px;

    >.svg-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }

    >p {
      font-size: 14px;
      line-height: 20px;
      color: var(--theme-color);
    }
  }
}
</style>
