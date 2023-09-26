<template>
  <div
    class="home-wrap-game"
    :style="{ 'background-image': `url(${$getSrc('/src/assets/images/home/hot_game_bg.png')})` }"
  >
    <div class="align-center-wrap">
      <div class="home-card-title">{{$t(`热门游戏`)}}</div>
      <div class="layout-flex-between game-wrap">
        <!-- :style="{ 'background-image': `url('${$getSrc(`/src/assets/images/home/${game.name}.png`)}')` }" -->
        <div
          v-for="game in gameList"
          :key="game.title"
          class="game-wrap-item"
          @click="goPath(game.path)"
        >
          <img
            :src="$getSrc(`/src/assets/images/home/${game.name}.png`)"
            alt=""
          />
          <div>
            <img
              :src="$getSrc(game.icon)"
              alt
            />
            <p>{{ game.title }}</p>
          </div>
          <el-button type="primary">{{$t(`立刻投注`)}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');
const gameList = [
  {
    title: global.$t(`体育`),
    name: 'game_sports_bg',
    icon: '/src/assets/images/home/game_sports_icon.png',
    bg: '/src/assets/images/home/game_sports_bg.png',
    path: '/sport',
  },
  {
    title: global.$t(`真人`),
    name: 'game_real_bg',
    icon: '/src/assets/images/home/game_real_icon.png',
    bg: '/src/assets/images/home/game_real_bg.png',
    path: '/casino',
  },
  {
    title: global.$t(`电子`),
    name: 'game_electronic_bg',
    icon: '/src/assets/images/home/game_electronic_icon.png',
    bg: '/src/assets/images/home/game_electronic_bg.png',
    path: '/slot',
  },
  {
    title: global.$t(`彩票`),
    name: 'game_lottery_bg',
    icon: '/src/assets/images/home/game_lottery_icon.png',
    bg: '/src/assets/images/home/game_lottery_bg.png',
    path: '/lottery',
  },
  // {
  //   title: global.$t(`棋牌`),
  //   name: 'game_chess_bg',
  //   icon: '/src/assets/images/home/game_chess_icon.png',
  //   bg: '/src/assets/images/home/game_chess_bg.png',
  //   path: '/chess',
  // },
  {
    title: global.$t(`电竞`),
    name: 'game_bg',
    icon: '/src/assets/images/home/game_icon.png',
    bg: '/src/assets/images/home/game_bg.png',
    path: '/esport',
  },
  // {
  //   title: global.$t(`捕鱼`),
  //   name: 'game_fish_bg',
  //   icon: '/src/assets/images/home/game_fish_icon.png',
  //   bg: '/src/assets/images/home/game_fish_bg.png',
  //   path: '/fishing',
  // },
];

function goPath(path) {
  global.$router.push({ path });
}
</script>

<style lang="scss" scoped>
.home-wrap-game {
  background-size: 100% 100%;
  padding: 23px 0 37px;
  .game-wrap {
    margin: 20px -30px 0 0;
    .game-wrap-item {
      // background-image: url('/src/assets/images/home/game.png');
      background-size: 100% 100%;
      background-position: 0 0;
      background-repeat: no-repeat;
      background-size: 100%;
      width: calc(100% / 5 - 30px);
      margin-right: 30px;
      box-sizing: border-box;
      position: relative;
      transition: all 0.4s linear;
      border-radius: 10px;
      overflow: hidden;

      > img {
        width: 100%;
        display: block;
        transition: all 0.4s linear;
      }
      &:hover {
        background-size: 120%;
        background-position: -25px -75px;

        > img {
          transform: scale(1.1);
        }
      }
      div {
        position: absolute;
        padding-top: 38px;
        width: 100%;
        top: 0;
        z-index: 2;
        img {
          display: inline-block;
          width: 42px;
        }
      }
      p {
        padding-top: 10px;
        font-size: 20px;
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        text-align: center;
        color: var(--font-color-fff);
        line-height: 20px;
        margin: 0;
      }
      :deep(.el-button) {
        min-width: 70%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 24px;
        border-radius: 0;
        font-size: 16px;
        height: 37px;
      }
    }
  }
}
</style>
