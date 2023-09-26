<template>
  <div
    class="real-wrap"
    :style="{ 'background-image': `url(${$getSrc('/src/current_project/assets/images/image_banner_bk.png')})` }"
  >
    <SubBanner id="1" />
    <div class="real-body">
      <div class="real-body-imgs">
        <div
          v-for="(game, index) in games"
          :index="index"
          :key="index"
          @click="$playGame(game)"
        >
          <el-image
            :class="{ 'middle': index > 0 }"
            :src="game?.page_pic"
          ></el-image>
          <el-button
            v-loadingBtn="game?.page_pic"
            class="game-button"
            v-login
            v-game-status|img="$getGameStatus(game, 1, 2)"
          >{{
              $t('立即游戏')
          }}
          </el-button>
        </div>
      </div>

      <div class="bottom-wrap">
        <div class="roadmap-wrap">
          <header>
            <SvgIcon name="thumb_up" />
            <span>{{ $t('热门游戏') }}</span>
          </header>
          <div class="roadmap-body">
            <RoadMap
              :canvas-width="371"
              :canvas-height="152"
              :cell-size="14"
              :is-show-tab="false"
              theme="theme2"
            />
            <el-button
              class="game-button"
              @click="$playGame(gameList[2])"
            >{{ $t('快速游戏') }}</el-button>
          </div>
        </div>
        <div class="rank-wrap">
          <header>
            <SvgIcon name="rank_star" />
            <span>{{ $t('今日盈利榜') }}</span>

            <div @click="$router.push({ name: 'transProfit' })">
              <span>{{ $t('查看更多') }}</span>
              <i class="el-icon-arrow-right" />
            </div>
          </header>

          <div class="rank-table-wrap">

            <div class="table-body">
              <div class="head">
                <span>{{ $t('会员名称') }}</span>
                <span>{{ $t('盈利金额') }}</span>
                <span>{{ $t('平台名称') }}</span>
              </div>
              <div
                class="body-row"
                v-for="item in toplistData"
                :key="item.username"
              >
                <span>{{ item.username }}</span>
                <span>¥{{ priceFormat(item.num) }}</span>
                <span>{{ matchPlat(item.platform_id) }}</span>
                <span
                  v-login
                  @click="$playGame(item)"
                  class="pointer"
                >{{
                    user?.isLogin ? $t('立即跟注') : $t('注册')
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  inject, watch, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { newtoplist } from '@/api/home';
import { priceFormat } from '@/utils/index';
import SubBanner from '@/components/Banner/sub.vue';
import RoadMap from '@/components/RoadMap/index.vue';
import SvgIcon from '../../../../components/SvgIcon.vue';

const $store = inject('store');
const { user } = $store.state;
const global = inject('global');
// const gameList = [
//   {
//     default_game_id: 15,
//     game_platform_id: 3,
//     game_platform_name: 'BBIN',
//     game_platform_mark: global.$t('最具影响力真人平台'),
//     name: 'BBIN',
//     title: 'BBIN',
//     thumb: '/src/current_project/assets/images/casino/real-bbin.png',
//     desc: [global.$t('最具影响力真人平台')],
//   },
//   {
//     default_game_id: 2100,
//     game_platform_id: 20,
//     game_platform_name: 'OG',
//     game_platform_mark: global.$t('贴近亚洲文化市场'),
//     name: 'OG',
//     title: `OG${global.$t('平台')}`,
//     thumb: '/src/current_project/assets/images/casino/real-og.png',
//     desc: [global.$t('贴近亚洲文化市场')],
//   }, {
//     default_game_id: 1,
//     game_platform_id: 1,
//     game_platform_name: 'AG',
//     game_platform_mark: global.$t('亚洲市场占有率第一领导品牌'),
//     name: 'AG',
//     title: global.$t('AG平台'),
//     classname: 'tall',
//     desc: [global.$t('互动多合一 快感加倍'), global.$t('百家乐、炸金花、骰宝等多款游戏')],
//     thumb: '/src/current_project/assets/images/casino/real-ag.png',
//   },
// ];

$store.dispatch('app/getDict', ['allplatform']);
const { dicts } = $store.state.app;

const games = computed(() => $store.state.game?.platformGameIdsv3[1]);

onMounted(() => {
  console.log(games.value);
});

// 游戏列表
const { run: toplistFn, data: toplistData, loading: toplistLoading } = useRequest(newtoplist, {
  manual: true,
  formatResult: (res) => res?.[0]?.list?.filter((item, index) => index < 5) ?? [],
});

watch(() => dicts.allplatform, () => {
  toplistFn();
});

// 匹配平台名称
function matchPlat(val) {
  return dicts.allplatform[Object.keys(dicts.allplatform)?.filter((item) => item * 1 === val) ?? ''];
}
</script>

<style lang="scss" scoped>
.real-body {
  padding-top: 50px;
  display: flex;
  align-items: center;
  flex-direction: column;

  .bottom-wrap {
    width: 1260px;
    display: flex;
    justify-content: center;
    margin-top: 33px;
    margin-bottom: 65px;

    >div {
      width: 615px;

      >div {
        height: 310px;
        box-sizing: border-box;
      }

      header {
        display: flex;
        align-items: center;
        padding: 0 15px;
        color: var(--font-color-333);
        margin-bottom: 6px;

        span {
          margin-right: auto;
          font-size: 24px;
          margin-left: 10px;
        }

        .svg-icon {
          width: 30px;
          height: 30px;
        }

        div {
          color: var(--font-color-979797);
          display: flex;
          align-items: center;
          cursor: pointer;

          span {
            font-size: 18px;
          }

          i {
            font-size: 22px;
          }
        }
      }
    }

    .rank-table-wrap {
      box-sizing: border-box;
      padding: 15px;

      .table-body {
        background-color: var(--bg-color-282828);
        padding: 30px;
        height: 100%;
        box-sizing: border-box;

        .head,
        .body-row {
          display: flex;
          align-items: center;
        }

        .head {
          color: var(--font-color-a7a7a7);
          font-size: 18px;
          margin-bottom: 14px;
        }

        .body-row {
          height: 35px;
          color: var(--font-color-333, var(--font-color-f5f5f5));
        }

        .head,
        .body-row {
          span {
            text-align: center;
          }

          span:first-child {
            width: 125px;
            text-align: left;
          }

          span:nth-child(2) {
            width: 132px;
            font-weight: bold;
          }

          span:nth-child(3) {
            width: 190px;
            margin-right: auto;
          }

          span:nth-child(4) {
            white-space: nowrap;
            color: var(--theme-color);
            cursor: pointer;
          }
        }
      }
    }

    .roadmap-wrap {
      position: relative;

      .roadmap-body {
        padding: 15px;
        box-sizing: border-box;
      }

      .game-button {
        right: 40px;
        bottom: 82px;
        z-index: 10;
        width: 122px;
        height: 45px;
        border-radius: unset;
      }
    }

  }

  .el-image {
    width: 100%;
    height: 100%;
  }

  .real-body-imgs {
    display: flex;
    flex-wrap: wrap;
    width: 1200px;

    >div {
      position: relative;

      &[index="0"] {
        margin-bottom: 30px;
        width: 1200px;
        height: 380px;

        .game-button {
          left: 40px;
          top: 227px;
        }
      }

      &:not(:first-child) {
        width: 584px;
        height: 250px;

        .game-button {
          position: absolute;
          left: 40px;
          top: 176px;
        }
      }

      &[index="1"] {
        margin-right: 30px;
      }

    }
  }
}
</style>
