<template>
  <div class="gamelist-wrap">
    <div class="align-center-wrap-1200">
      <ul>
        <li>
          <div class="cover">
            <svg-icon name="title" />
            <div class="info">
              <h2>{{ $t(`精益求精 成就非凡`) }}</h2>
              <p>{{ $t(`汇聚最热门的电子、棋牌、捕鱼游戏`) }}</p>
            </div>
            <div class="childlist" :class="[`game-type-${activeIndex}`]">
              <template v-if="activeIndex === 0">
                <div v-for="item in chessList.slice(0, 4) " :key="item.page_pic" v-login @click="$playGame(item)">
                  <div>
                    <el-image class="small" :src="$getSrc(item.page_pic)" />
                    <div v-gameStatus|img="$getGameStatus(item)">{{ $t('维护中') }}</div>
                  </div>
                  <p>{{ item.name }}</p>
                </div>
              </template>
              <template v-else-if="activeIndex === 1">
                <div v-for="(item, index) in slotList " :key="item.page_pic" v-login v-show="index <= 5"
                  @click="gotoElectron(item)">
                  <div>
                    <el-image class="small" :src="$getSrc(item.page_pic)" />
                    <div v-gameStatus|img="$getGameStatus(item)"></div>
                  </div>
                  <p>{{ item.code.toUpperCase() }}{{ $t(`电子`) }}</p>
                </div>
              </template>
              <template v-else>
                <div v-for="(item, index) in fishList.slice(0, 2)" v-login :key="item.page_pic" v-show="index <= 5"
                  @click="$playGame(item)">
                  <div>
                    <el-image class="small" :src="$getSrc(item.page_pic)" />
                    <div v-gameStatus|img="$getGameStatus(item)"></div>
                  </div>
                  <p>{{ item.name }}</p>
                </div>
              </template>
            </div>
          </div>
          <div class="play-btn" @click="$router.push(gameList[activeIndex].path)">
            <span>
              {{ $t(`开始`) }}
              <br />
              {{ $t(`游戏`) }}
            </span>
          </div>
        </li>
        <li :class="activeIndex === 0 ? 'active' : ''" @mouseenter="activeIndex = 0">
          <div class="cover">
            <img src="/src/current_project/assets/images/channel/chess.png" alt />
          </div>
          <div class="info">
            <h2>{{ $t(`棋牌竞技`) }}</h2>
            <p>{{ $t(`汇聚全球最热门的棋牌游戏，万人在线，火热PK!`) }}</p>
          </div>
        </li>
        <li :class="activeIndex === 1 ? 'active' : ''" @mouseenter="activeIndex = 1">
          <div class="cover">
            <img src="/src/current_project/assets/images/channel/slots.png" alt />
          </div>
          <div class="info">
            <h2>{{ $t(`电子游艺`) }}</h2>
            <p>{{ $t(`汇聚世界顶级电子游艺平台，万款老虎机游戏等你来战！`) }}</p>
          </div>
        </li>
        <li :class="activeIndex === 2 ? 'active' : ''" @mouseenter="activeIndex = 2">
          <div class="cover">
            <img src="/src/current_project/assets/images/channel/fishing.png" alt />
          </div>
          <div class="info">
            <h2>{{ $t(`捕鱼达人`) }}</h2>
            <p>{{ $t(`捕鱼游戏强势来袭，众多热门平台，天天送豪礼！`) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {
  inject,
  ref,
} from 'vue';
import { chessList, fishList, slotList } from './gameData';

const global = inject('global');
const $store = inject('store');

$store.dispatch('app/getDict', 'platformgameidsv2');
const activeIndex = ref(0);

const gameList = [
  {
    type: global.$t(`棋牌`),
    path: '/chess',
  },
  {
    type: global.$t(`电子`),
    path: '/slot',
    matchList: [],
  },
  {
    type: global.$t(`捕鱼`),
    path: '/fishing',
  },
];

function gotoElectron(item) {
  if (item.status !== 2) {
    global.$router.push({
      path: '/slot',
      query: { electronType: item.code },
    });
  }
}

// const soltList = computed(() => $store.state.game?.platformGameIdsv3[2] ?? []);
// const fishList = computed(() => $store.state.game?.platformGameIdsv3[3] ?? []);
// const chessList = computed(() => $store.state.game?.platformGameIdsv3[5] ?? []);
</script>
<style lang="scss" scoped>
.gamelist-wrap {
  background-color: var(--bg-color-09121d);
  padding-bottom: 30px;

  .play-btn {
    width: 97px;
    height: 97px;
    position: relative;
    text-align: center;
    padding-top: 30px;
    font-size: 14px;
    color: var(--font-color-fff);
    margin: -86px auto 0;
    cursor: pointer;
    box-sizing: border-box;

    &:hover::after {
      transform: rotate(180deg);
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('/src/current_project/assets/images/channel/play-bg.png') no-repeat;
      background-size: cover;
      transition: 0.3s;
    }

    span {
      position: relative;
      z-index: 2;
      line-height: 18px;
    }
  }

  ul {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    li {
      width: 280px;
      position: relative;
      cursor: pointer;

      &:not(:first-child):hover,
      &.active {
        .info {
          h2 {
            color: var(--theme-color);
          }
        }
      }

      .cover {
        position: relative;

        img {
          display: block;
          width: 100%;
        }

        .svg-icon {
          width: 180px;
          height: 34px;
          fill: var(--theme-color);
        }
      }

      .info {
        text-align: left;
        padding: 0;
        padding: 0 10px 0 23px;
        margin-top: -5px;

        h2 {
          font-size: 22px;
          color: var(--font-color-333);
          font-weight: bold;
          margin: 0 0 8px;
          line-height: 30px;
        }

        p {
          font-size: 10px;
          line-height: 14px;
          color: var(--font-color-fff-5);
        }
      }

      &:first-child {
        margin-top: 130px;
        cursor: default;

        .cover {
          height: 440px;
          background: url('/src/current_project/assets/images/channel/border.png') no-repeat;
          background-size: 100% auto;
          padding-top: 38px;

          img {
            width: 180px;
            margin: 0 auto;
          }

          .info {
            text-align: center;
            margin-top: 12px;

            p {
              font-size: 14px;
              color: var(--font-color-fff);
            }
          }
        }
      }

      &:nth-child(2) {
        margin-top: 185px;
      }

      &:nth-child(3) {
        margin-top: 62px;
      }

      &:nth-child(4) {
        margin-top: 125px;
      }
    }
  }

  .childlist {
    text-align: center;
    font-size: 0;
    display: flex;
    box-sizing: border-box;
    flex-wrap: wrap;
    padding: 0 15px;
    justify-content: space-between;

    >div {
      cursor: pointer;

      &:hover p {
        color: var(--theme-color);
      }

      .el-image {
        .image-loading {
          height: 100%;
          background-size: auto 50%;
          background-repeat: no-repeat;
          background-position: center;
          background-color: #ccc;
          border-radius: 10px;
        }
      }

      img {
        display: block;
        width: 60px !important;
        height: 60px;
      }

      p {
        margin-bottom: 12px;
        margin-top: 6px;
        font-size: 12px;
        color: var(--font-color-d0d0d0);
        text-align: center;
      }
    }

    &.game-type-0 {
      margin-top: 38px;

      div {
        width: 120px;

        .el-image {
          width: 120px;
          height: 80px;
        }
      }
    }

    &.game-type-1 {
      margin-top: 38px;

      >div {
        width: 77px;

        p {
          margin-bottom: 5px;
        }

        &:nth-child(1),
        &:nth-child(2) {
          width: 120px;

          .el-image {
            height: 80px;
            width: 120px;
          }
        }

        .el-image {
          width: 77px;
          height: 80px;
        }
      }
    }

    &.game-type-2 {
      margin-top: 40px;

      div {
        width: 122px;

        .el-image {
          width: 122px;
          height: 180px;
        }
      }
    }
  }
}
</style>
