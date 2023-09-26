<template>
  <div class="nav-wrap">
    <ul class="align-center-wrap">
      <li>
        <!-- v-if="!!dicts?.siteinfo?.logo" -->
        <img :src="dicts?.siteinfo?.logo ?? $getSrc('/src/assets/images/header/logo.png')" alt="logo"
          @click="$router.push('/')" class="logo" />
      </li>
      <li>
        <div class="nav-list">
          <div v-for="(ele, index) in navRouter" :key="ele.path"
            :class="currentPath === ele.path ? 'active list-item-wrap' : 'list-item-wrap'">
            <div class="layout-flex-center list-item-wrap-tit" @click="handlerNav(ele)">
              <span>{{ $t(ele.meta.title) }}</span>
              <i v-show="ele.path !== '/'" class="icon el-icon-arrow-down"></i>
            </div>
            <NavPopup class="nav-popup-wrap" :subnav="routeNav[index - 1]" />
          </div>
        </div>
        <div lang-select />
      </li>
    </ul>
  </div>
</template>

<script setup>
import {
  inject, watch, ref, onMounted, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import NavPopup from './NavPopup.vue';
import { allactivitybenefit } from '@/api/vip';
import { activitylist } from '@/api/active';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;

const $router = useRouter();
const { options: { routes } } = $router;
const navRouter = ref([]);

const routeNav = ref([]);

const { data: proportion } = useRequest(allactivitybenefit, {
  formatResult: (res) => res.reduce((curr, next) => {
    curr[next.game_cate_id] = Math.max(...next.list.map((item) => item.proportion));
    return curr;
  }, {}),
});
// const activeData = ref([]);
const { data: activeData } = useRequest(() => activitylist({ type: 1 }), {
  formatResult: (res) => res.data,
});

watchEffect(() => {
  navRouter.value = [...routes[0].children, { meta: { title: global.$t('更多') }, path: '' }];
  routeNav.value = [
    {
      type: global.$t('体育'),
      title: global.$t(`体育`),
      propotion: proportion?.value[4],
      btnText: global.$t(`优惠详情`),
      tip: global.$t(`返水无上限`),
      gameBtn: global.$t(`立即游戏`),
      to: 'sport',
      games: [
        {
          typeId: 4,
          title: global.$t(`IBC体育`),
          pic: '/src/assets/images/header/sport/ibc.png',
          default_game_id: 18,
          game_platform_id: 13,
          name: 'IBC',
          enterGame: true,
        },
        {
          typeId: 4,
          title: global.$t(`BTI体育`),
          pic: '/src/assets/images/header/sport/bti.png',
          default_game_id: 9668,
          game_platform_id: 136,
          name: 'BTI',
          enterGame: true,
        },
        {
          typeId: 4,
          title: global.$t(`IM体育`),
          pic: '/src/assets/images/header/sport/im.png',
          default_game_id: 4223,
          game_platform_id: 117,
          name: 'IMSB',
          enterGame: true,
        },
      ],
    }, {
      type: global.$t('电竞'),
      title: global.$t(`电竞`),
      propotion: proportion?.value[8],
      btnText: global.$t(`优惠详情`),
      tip: global.$t(`返水无上限`),
      gameBtn: global.$t(`立即游戏`),
      to: 'esport',
      games: [
        {
          typeId: 8,
          title: global.$t(`IBC电竞`),
          pic: '/src/assets/images/header/esport/ibc.png',
          enterGame: true,
          default_game_id: 1549,
          game_platform_id: 13,
          name: 'IBC',
        },
        // { title: global.$t(`BTI电竞`), pic: '/src/assets/images/header/esport/bti.png', enterGame: true },
        {
          typeId: 8,
          title: global.$t(`IM电竞`),
          pic: '/src/assets/images/header/esport/im.png',
          enterGame: true,
          default_game_id: 4224,
          game_platform_id: 118,
          name: 'ESB',
        },
      ],
    }, {
      type: global.$t('真人'),
      title: global.$t(`真人`),
      propotion: proportion?.value[1],
      btnText: global.$t(`优惠详情`),
      tip: global.$t(`返水无上限`),
      gameBtn: global.$t(`立即游戏`),
      to: 'casino',
      games: [
        {
          typeId: 1,
          title: global.$t(`AG平台`),
          pic: '/src/assets/images/header/real/ag.png',
          default_game_id: 1,
          game_platform_id: 1,
          name: 'AG',
          enterGame: true,
        },
        {
          typeId: 1,
          title: global.$t(`N2Live平台`),
          pic: '/src/assets/images/header/real/n2live.png',
          default_game_id: 9702,
          game_platform_id: 140,
          name: 'N2LIVE',
          enterGame: true,
        },
        {
          typeId: 1,
          title: global.$t(`SEXY平台`),
          pic: '/src/assets/images/header/real/sexy.png',
          default_game_id: 9674,
          game_platform_id: 138,
          name: 'SEXY',
          enterGame: true,
        },
        {
          title: global.$t(`更多游戏`), pic: '/src/assets/images/header/real/more.png', enterGame: false, to: 'casino',
        },
      ],
    }, {
      type: global.$t('电子'),
      title: global.$t(`电子`),
      propotion: proportion?.value[2],
      btnText: global.$t(`优惠详情`),
      tip: global.$t(`返水无上限`),
      gameBtn: global.$t(`立即游戏`),
      to: 'slot',
      games: [
        {
          typeId: 2,
          title: global.$t(`PT电子`),
          pic: '/src/assets/images/header/slot/pt.png',
          default_game_id: 3990,
          game_platform_id: 116,
          name: 'PT',
          enterGame: false,
          to: 'slot',
          id: 'PT',
        },
        {
          typeId: 2,
          title: global.$t(`MG电子`),
          pic: '/src/assets/images/header/slot/mg.png',
          default_game_id: 647,
          game_platform_id: 7,
          name: 'MG',
          enterGame: false,
          to: 'slot',
          id: 'MG',
        },
        {
          typeId: 2,
          title: global.$t(`PG电子`),
          pic: '/src/assets/images/header/slot/pg.png',
          default_game_id: 1,
          game_platform_id: 1,
          name: 'PG',
          enterGame: false,
          to: 'slot',
          id: 'PG',
        },
        {
          title: global.$t(`更多游戏`), pic: '/src/assets/images/header/slot/more.png', enterGame: false, to: 'slot',
        },
      ],
    }, {
      type: global.$t('彩票'),
      title: global.$t(`彩票`),
      propotion: proportion?.value[5],
      btnText: global.$t(`优惠详情`),
      tip: global.$t(`日返水返还`),
      gameBtn: global.$t(`立即游戏`),
      to: 'lottery',
      games: [
        // {
        //   typeId: 5,
        //   title: global.$t(`SG-WIN双赢彩`),
        //   pic: '/src/assets/images/header/lottery/sgwin.png',
        //   default_game_id: 4421,
        //   game_platform_id: 122,
        //   name: 'SG',
        //   enterGame: true,
        // },
        {
          typeId: 5,
          title: global.$t(`GPI平台`),
          pic: '/src/assets/images/header/lottery/lb.png',
          default_game_id: 9704,
          game_platform_id: 141,
          name: 'GPI',
          enterGame: true,
        },
      ],
    },
    // {
    //   type: global.$t('捕鱼'),
    //   title: global.$t(`捕鱼`),
    //   propotion: proportion?.value[3],
    //   btnText: global.$t(`优惠详情`),
    //   tip: global.$t(`日返水返还`),
    //   gameBtn: global.$t(`立即游戏`),
    //   enterGame: true,
    //   to: 'fishing',
    //   games: [
    //     {
    //       typeId: 3,
    //       title: global.$t(`AG捕鱼`),
    //       pic: '/src/assets/images/header/fish/ag.png',
    //       default_game_id: 12,
    //       game_platform_id: 1,
    //       name: 'AG',
    //       enterGame: true,
    //     },
    //     // {
    //     //   typeId: 3,
    //     //   title: global.$t(`PP捕鱼`),
    //     //   pic: '/src/assets/images/header/fish/sa.png',
    //     //   default_game_id: 12,
    //     //   game_platform_id: 1,
    //     //   name: '',
    //     //   enterGame: true,
    //     // },
    //     // {
    //     //   title: global.$t(`SA捕鱼`),
    //     //   pic: '/src/assets/images/header/fish/sa.png',
    //     //   default_game_id: 12,
    //     //   game_platform_id: 1,
    //     //   name: '',
    //     //   enterGame: true,
    //     // },
    //   ],
    // },
    {
      type: global.$t('优惠'),
      gameBtn: global.$t(`优惠详情`),
      to: '',
      games: [
        {
          title: global.$t(`VIP红利`), pic: '/src/assets/images/header/promos/vip@3x.png', to: 'promos', id: 1, enterGame: false,
        },
        {
          title: global.$t(`新手红利`), pic: '/src/assets/images/header/promos/xs@3x.png', to: 'promos', id: 2, enterGame: false,
        },
        {
          title: global.$t(`专题红利`), pic: '/src/assets/images/header/promos/zt.png', to: 'promos', id: 3, enterGame: false,
        },
        {
          title: global.$t(`常规红利`), pic: '/src/assets/images/header/promos/cg@3x.png', to: 'promos', id: 4, enterGame: false,
        },
      ],
    }, {
      gameBtn: global.$t(`立即查看`),
      enterGame: false,
      to: '',
      games: [
        // { title: global.$t(`推荐好友`), pic: '/src/assets/images/header/more/tj@3x.png', enterGame: false },
        {
          title: global.$t(`钻石俱乐部`), pic: '/src/assets/images/header/more/zs@3x.png', to: 'vip', enterGame: false,
        },
        // { title: global.$t(`品牌赞助`), pic: '/src/assets/images/header/more/ppzz@3x.png', enterGame: false },
        {
          title: global.$t(`下载中心`), pic: '/src/assets/images/header/more/download@3x.png', to: 'appDownload', enterGame: false,
        },
      ],
    },
  ];
});

onMounted(() => {
  $store.dispatch('app/getDict', 'siteinfo');
});

const currentPath = ref('/');

watch($router.currentRoute, (val) => {
  currentPath.value = val.path;
}, { immediate: true });

const handlerNav = (item) => {
  if (item.path) {
    $router.push({ path: item.path });
  }
};
</script>

<style lang="scss">
.nav-wrap .nav-list .list-item-wrap:not(:nth-of-type(1)):hover .nav-popup-wrap {
  visibility: visible;
  opacity: 1;
  height: 218px;
}

.nav-wrap {
  position: relative;

  ul {
    list-style: none;
    height: 58px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    li {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .logo {
        cursor: pointer;
      }

      >img {
        width: 161px;
      }

      .nav-list {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .list-item-wrap {
          margin-left: 6px;
          font-size: 15px;
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          color: var(--font-color-fff);
          line-height: 23px;
          cursor: pointer;

          &-tit {
            padding: 18px;

            span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: block;
            }
          }

          .icon {
            margin-left: 10px;
          }

          &:hover {
            color: var(--theme-color);

            .icon {
              color: var(--theme-color);
            }
          }

          &.active {
            color: var(--theme-color);

            .icon {
              color: var(--theme-color);
            }
          }
        }
      }

      .icon-white {
        color: var(--font-color-fff);
      }
    }

    .lang {
      height: 14px;

      p {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;

        img {
          width: 20px;
          height: 14px;
        }

        .icon-white {
          color: var(--font-color-fff);
          margin-left: 3px;
          font-size: 12px;
        }
      }
    }
  }
}

@media screen and (max-width: 1530px) {
  .list-item-wrap-tit span {
    max-width: 60px;
  }
}

@media screen and (min-width: 1530px) and (max-width: 1630px) {
  .list-item-wrap-tit span {
    max-width: 90px;
  }
}
</style>
