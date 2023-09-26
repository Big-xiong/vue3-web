<template>
  <div class="nav-wrap">
    <div class="layout-flex-center">
      <div
        v-for="item in list"
        :key="item.name"
        :class="['nav-wrap-item', data.activeName === item.name ? 'active' : '', 'pointer']"
        @click="go(item)"
      >
        <div class="nav-wrap-item-underline">
          <div>{{ $t(item.name) }}</div>
        </div>
        <!-- getGameNavList(item.gameId,platformgameidsv3).length>0 -->
        <div
          v-if="getGameNavList(item.gameId, platformgameidsv3).length > 0 && item.path !== ''"
          class="nav-wrap-item-hover"
        >
          <div class="align-center-wrap-1200 layout-flex-center">
            <div
              class="nav-wrap-item-left"
              :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/AMX/header/rate-bg-${item.discountImg}.png`)})` }"
            >
              <div class="item">
                <div class="title">{{ $t('最高返水') }}</div>
                <div class="rate">{{ getWashRate(item.gameId, platformgameidsv3) }}%</div>
              </div>
            </div>
            <div
              class="nav-wrap-item-hover-item"
              :class="[`game-${item.path.replace('/', '')}`]"
            >
              <template
                v-for="(temp, index) in getGameNavList(item.gameId, platformgameidsv3)"
                :key="index"
              >
                <div :class="['item', item.path.includes('esport') ? 'type-2' : '',]">
                  <div class="title">
                    {{ temp.name }}
                  </div>

                  <div
                    v-login
                    @click="$playGame(temp, item.gameId)"
                  >
                    <img
                      :src="temp.nav_pic"
                      fit="contain"
                    >
                    <div v-game-status|img="temp.status === 2"></div>
                  </div>

                </div>
              </template>
            </div>
            <!--  app下载  -->
            <div class="er-code">
              <span>{{ $t('扫描下载') }}APP</span>
              <div class="bottom">
                <img
                  id="er_code"
                  :src="er_pic"
                  alt
                />
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
  inject, reactive, computed, watchEffect, onMounted, watch, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import qrcode from 'qrcode';

const $store = inject('store');
$store.dispatch('game/getPlatformGameIdsv3');
const global = inject('global');
const data = reactive({
  activeName: '',
  realItem: {
    default_game_id: 1,
    game_platform_id: 1,
    game_platform_name: 'AG',
    name: 'AG',
  },
  navObj: {},
});
const er_pic = ref('');
const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3,
  },
};
const list = {
  '/': {
    name: global.$t('首页'),
    path: '/',
  },
  '/real': {
    name: global.$t('真人'),
    path: '/real',
    title: global.$t('真人娱乐'),
    text: global.$t('真人'),
    rate: '0.8%',
    discount: global.$t('百家乐连赢大奖'),
    discountImg: 'real',
    gameId: 1,
    children: [],
  },
  '/slot': {
    name: global.$t('电子'),
    path: '/slot',
    title: global.$t('电子娱乐'),
    text: global.$t('电子'),
    rate: '1.1%',
    discount: global.$t('如虎添翼奖上奖'),
    discountImg: 'slot',
    gameId: 2,
    children: [],
  },
  '/lottery': {
    name: global.$t('彩票'),
    path: '/lottery',
    title: global.$t('彩票娱乐'),
    text: global.$t('彩票'),
    rate: '0.8%',
    discount: global.$t('首存送30%'),
    discountImg: 'lottery',
    gameId: 5,
    children: [],
  },
  '/chess': {
    name: global.$t('棋牌'),
    path: '/chess',
    title: global.$t('棋牌娱乐'),
    text: global.$t('棋牌'),
    rate: '0.4%',
    discount: global.$t('首存送30%'),
    discountImg: 'chess',
    gameId: 7,
    children: [],
  },
  '/sport': {
    name: global.$t('体育'),
    path: '/sport',
    title: global.$t('体育娱乐'),
    text: global.$t('体育'),
    rate: '0.6%',
    discount: global.$t('首存送30%'),
    discountImg: 'sport',
    gameId: 4,
    children: [],
  },
  '/esport': {
    name: global.$t('电竞'),
    path: '/esport',
    title: global.$t('电竞娱乐'),
    text: global.$t('电竞'),
    rate: '0.4%',
    discount: global.$t('首存送30%'),
    discountImg: 'esport',
    gameId: 8,
    children: [],
  },
  '/fishing': {
    name: global.$t('捕鱼'),
    path: '/fishing',
    title: global.$t('捕鱼娱乐'),
    text: global.$t('捕鱼'),
    rate: '1.1%',
    discount: global.$t('首存送30%'),
    discountImg: 'fishing',
    gameId: 3,
    children: [],
  },
  '/brand': {
    name: global.$t('品牌实力'),
    path: '/brand',
  },
  '/vip': {
    name: global.$t('VIP'),
    path: '/vip',
  },
  '/promos': {
    name: global.$t('活动专区'),
    path: '/promos',
  },
};

const route = useRoute();
watch(() => route.path, () => {
  data.activeName = list[route.path]?.name ?? '';
}, { immediate: true });
const platformgameidsv3 = computed(() => $store.state?.game?.platformGameIdsv3?.all);

function getWashRate(id, list) {
  if (id) {
    const games = list.find((item) => item.game_cate_id === id).list_data;
    return Math.max(...games.map((item) => item.wash_rate));
  }
  return 0;
}

function getGameNavList(id, arr = []) {
  if (arr.length <= 0) return [];
  const games = [];
  const temp = arr.find((item) => item.game_cate_id === id);
  if (temp?.list_data) {
    temp.list_data.forEach((item) => {
      if (item.page_type === 1) { // && games.findIndex(e => e.code === code) == -1
        games.push({
          ...item,
          // logo:global.$getSrc(`/src/current_project/assets/images/header/game/${temp.game_cate_id}/${code}.png`)
        });
      }
    });
  }
  return games;
}

function go(item) {
  data.activeName = item.name;
  global.$router.push(item.path);
}
onMounted(() => {
  qrcode.toDataURL(`https://m.${window.location.host}/appDownload`, opts, (err, url) => {
    if (err) throw err;
    er_pic.value = url;
  });
});
</script>
<style lang="scss" scoped>
/* stylelint-disable */
.nav-wrap {
  height: 40px;
  flex: 1;

  >div {
    height: 100%;
    justify-content: flex-start;

    .nav-wrap-item {
      color: var(--font-color-a9a9a9);
      cursor: pointer;
      text-align: center;
      margin: 0 10px;

      &-underline {
        >div {
          height: 20px;
          line-height: 20px;
        }
      }

      &:hover,
      &.active {
        color: var(--theme-color);
      }

      &.active {
        .nav-wrap-item-underline {
          >div {
            position: relative;

            &::after {
              content: '';
              height: 2px;
              background-color: var(--theme-color);
              position: absolute;
              width: 12px;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
            }
          }
        }
      }

      &:last-child {
        margin-right: 0;
        border-right: 0;

        >div>div {
          border-right: none;
        }
      }

      .nav-wrap-item-hover {
        visibility: hidden;
        opacity: 0;
        transform: translateY(-10px) scale(0.9);
        transition: all 0.45s ease-out;
        position: absolute;
        width: 100%;
        height: 200px;
        background: var(--nav-hover-bg-color);
        top: 100px;
        left: 0;
        z-index: -1;
        box-sizing: border-box;

        >div {
          align-items: flex-start;
          justify-content: flex-start;
        }

        .title {
          font-size: 13px;
          color: var(--font-color-fff);
          letter-spacing: 0;
          height: 13px;
          text-align: center;
          margin-top: 11px;
        }

        .nav-wrap-item-left {
          border: 0;
          width: 112px;
          flex-shrink: 0;
          height: 160px;
          background-size: 100% auto;
          background-repeat: no-repeat;
          background-position: center bottom;
          margin-top: 10px;
          position: relative;

          &::before {
            content: ' ';
            width: 112px;
            height: 160px;
            z-index: 10;
            position: absolute;
            top: 0;
            left: 0;
            background-image: url(/src/assets/images/AMX/header/rate-bg-outter@2x.png);
            background-size: cover;
            background-repeat: no-repeat;
          }

          .item {
            margin: 0;

            .title {
              line-height: 28px;
              margin-top: 10px;
              margin-bottom: 0;
            }

            .rate {
              font-size: 44px;
              color: var(--theme-color);
              letter-spacing: 0;
              text-align: center;
              margin-top: 8px;
              font-weight: bold;
            }
          }
        }

        .line {
          width: 1px;
          height: 235px;
          border-right: 1px solid var(--border-color-353435);
          margin-top: 45px;
        }

        &-item {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: space-around;
          padding: 0px 20px 0;

          .item {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            border-right: 0;

            &:hover {
              .title {
                color: var(--nav-hover-color, var(--theme-color));
              }

              img {
                transform: scale(1.1);
              }
            }

            >div {
              position: relative;

              &:last-child {
                height: 176px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
            }

            img {
              margin-bottom: 5px;
              width: auto;
              height: 142px;
              transition: all 0.3s ease-in-out;
            }

            &:hover>.el-image {
              transform: scale(1.1);
            }

            .show {
              width: 250px;
              height: 130px;
              margin: 12px 0 18px;
            }
          }
        }

        .er-code {
          border: 0;

          span {
            font-size: 18px;
            color: var(--font-color-fff);
            display: block;
            margin-bottom: 30px;
            margin-top: 10px;
          }

          .top {
            .text {
              width: 143px;
            }

            .arrow {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 26px;
              animation: arrow_move 1s linear 1s infinite alternate;
            }

            position: relative;
            margin-bottom: 20px;
          }

          .bottom {
            position: relative;
            width: 104px;
            height: 104px;
            margin: 0 auto;
            background: url('@img/header/nav-code-bg.png') no-repeat;
            background-size: 104px auto;

            .zs {
              width: 100%;
            }

            #er_code {
              position: absolute;
              width: 90px;
              height: 90px;
              left: 7px;
              top: 7px;
            }
          }
        }

        button {
          border: 1px solid var(--border-color-353435);
          background-color: transparent;
          border-radius: 4px;
          width: 145px;
          height: 48px;
          font-size: 16px;
          color: var(--font-color-fff);
          transition: all 0.45s ease-out;
          cursor: pointer;

          &:hover {
            background: var(--area-color);
          }
        }
      }

      &:hover {
        .nav-wrap-item-hover {
          visibility: visible;
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    }
  }

  @keyframes arrow_move {
    from {
      bottom: -4px;
    }

    to {
      bottom: 4px;
    }
  }
}

.game-esport {
  justify-content: center !important;

  .item:first-child {
    margin-right: 90px;
  }
}

.game-fishing {
  justify-content: center !important;

  .item:first-child {
    margin-right: 250px;
  }
}

.game-sport {
  justify-content: center !important;

  .item:first-child {
    margin-right: 234px;
  }
}
</style>
