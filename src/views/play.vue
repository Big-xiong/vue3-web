<template>
  <div class="game-play-wrap" :style="{ 'background-image': `url(${$getSrc('/src/assets/images/play.jpg')})` }">
    <iframe id="gameIframe" :src="data.src" frameborder="0" />
  </div>
</template>

<script setup>
import {
  inject, reactive, onBeforeUnmount, onMounted,
} from 'vue';
import { openGame } from '@/api/app';
import { useTimeout } from '@/utils/hooks';
import { createSocket, onCloseWS } from '@/plugins/socket';
import { loadPTGame } from '../utils/game';
// import { trans, backtransall } from '@/api/center';

const global = inject('global');

const { dicts, lang } = global.$store.state.app;

const { query } = global.$router.currentRoute.value;

const data = reactive({
  src: '',
  timer: null,
  result: false,
});

const game_id = +query.game_id;
const platform_id = +query.platform_id;
const cate_id = +query.cate_id;
let url = decodeURIComponent(query.url);
// 处理vr游戏
onMounted(() => {
  global.$store.dispatch('app/getDict', 'allplatform').then(() => {
    if (dicts.allplatform[platform_id] === 'PT' && url.split(':')[0] === 'http') {
      url = url.replace('http', 'https');
    }

    play({
      url,
      open_mode: query.open_mode,
    });
  });
  init();
});

onBeforeUnmount(() => {
  onCloseWS();
});

async function autoTrans() {
  // if (global.$store.state.user.walletInfo.open_mode === 1) {
  //   await backtransall();
  // }
  // const { money } = await global.$store.dispatch('user/getWalletInfo');
  // await trans({
  //   money: +money,
  //   from_platform_id: 0,
  //   to_platform_id: query.platform_id,
  // });
}

function init() {
  if (!([2].includes(cate_id) && [3, 121].includes(platform_id))) {
    window.onbeforeunload = () => {
      if (
        (data.src.split(':')[0] === 'http'
          && document.domain === import.meta.env.VITE_APP_GAME_DOMAIN)
        || (data.src.split(':')[0] === 'https'
          && document.domain !== import.meta.env.VITE_APP_GAME_DOMAIN)
        || (document.domain === import.meta.env.VITE_APP_GAME_DOMAIN
          && dicts.allplatform[platform_id] === 'PT')
      ) {
        if (navigator.sendBeacon) {
          const params = {
            game_id,
            platform_id,
            access_token: self.token || query.at,
            merchant_no: import.meta.env.VITE_APP_MERCHANT_NO,
          };
          data.result = navigator.sendBeacon(
            `${import.meta.env.VITE_APP_WEB_API_URL}/backtrans`,
            params,
          );
          window.localStorage.setItem('backtrans-result', data.result);
        } else {
          // onCloseWS();
          // xhr({
          //   type: 'POST',
          //   url: import.meta.env.VITE_APP_WEB_API_URL + 'backtrans',
          //   data: {
          //     game_id,
          //     platform_id,
          //     access_token: self.token || query.at,
          //     merchant_no: import.meta.env.VITE_APP_MERCHANT_NO
          //   },
          //   async: false,
          //   success: res => {
          //     // clearInterval(self.timer)
          //     onCloseWS()
          //   }
          // })
        }
      }
    };
  }
}

window.openGame = () => openGame({ game_id, platform_id, retry: 1 });

async function play() {
  const loading = global.$loading();
  openGame({
    game_id,
    platform_id,
  }).then(async (res) => {
    if (platform_id === 142) {
      console.log('loadPTGame');
      loadPTGame(res, lang);
      return;
    }

    if ((res.open_mode && res.open_mode === 2) || res.redirect) {
      window.location.href = res.url;
      return false;
    }

    if (
      (res.url.split(':')[0].toLowerCase() === 'http'
        && document.domain !== import.meta.env.VITE_APP_GAME_DOMAIN)
      || (dicts.allplatform[platform_id] === 'PT'
        && document.domain !== import.meta.env.VITE_APP_GAME_DOMAIN)
    ) {
      window.location.href = `http://${import.meta.env.VITE_APP_GAME_DOMAIN}/play?game_id=${game_id}&platform_id=${platform_id}&at=${query.at}`;
      return;
    } if (
      [121].includes(platform_id)
      || ([2, 4].includes(cate_id) && [3].includes(platform_id))
      || dicts.allplatform[platform_id] === 'PT'
    ) {
      if ([121].includes(platform_id)) {
        window.location.href = res.url.toLowerCase().includes('http')
          ? res.url
          : `http://${res.url}`;
      } else {
        window.location.href = res.url;
      }
      return;
    }
    data.src = res.url.toLowerCase().includes('http') ? res.url : `http://${res.url}`;
    loading.close();
    gameCheck();
  });
}

function gameCheck() {
  // if (this.timer) {
  //   clearInterval(this.timer)
  // }
  // const game_id = query.game_id
  createSocket(`${import.meta.env.VITE_APP_WS_URL}connect?token=${query.at}&ctype=user`);
  // this.timer = setInterval(() => {
  //   onlinecheck({ game_id, access_token })
  // }, 5000)
}

</script>

<style lang="scss" scoped>
.game-play-wrap {
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-color-191919);
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;

  #gameIframe {
    width: 100%;
    height: 100%;
  }
}
</style>
