<template>
  <div
    class="lottery-wrap"
    :style="{ 'background-image': `url(${$getSrc('/src/current_project/assets/images/image_banner_bk.png')})` }"
  >
    <SubBanner id="5" />

    <div class="lottery-body">
      <div
        v-for="(_, index) in games"
        :index="index"
        :key="index"
        @click="$playGame(games[index])"
      >
        <el-image :src="games[index]?.page_pic"></el-image>
        <el-button
          class="game-button"
          v-loadingBtn="games[index]?.page_pic"
          v-login
          v-game-status|img="$getGameStatus(games[index], 5, 2)"
        >{{ $t('立即游戏') }}
        </el-button>
      </div>
    </div>

    <div class="hot-lottery-wrap">
      <header>
        <div class="title-wrap">
          <SvgIcon name="thumb_up" />
          <span>{{ $t('热门彩种') }}</span>
        </div>
      </header>

      <div class="lottery-scroll">
        <div
          class="lottery-item"
          v-for="(item, index) in GameData"
          :key="item.pic"
        >
          <el-image
            :class="{ 'middle': index > 0 }"
            :src="$getSrc(item.pic)"
          ></el-image>
          <div
            class="footer"
            v-game-status|img="$getGameStatus(item, 5, 2)"
          >
            <span>{{ item.title }}</span>
            <el-button
              v-login
              @click="$playGame(item, 'v2')"
            >{{ $t('快速游戏') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  inject, computed, watch, reactive, ref,
} from 'vue';
import GameData from './data';
import SubBanner from '@/components/Banner/sub.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const $store = inject('store');
$store.dispatch('game/getPlatformGameIdsv2');
const games = computed(() => $store.state.game?.platformGameIdsv3[5] ?? []);

// const hotLottery = computed(() => games.value ?? []);

// const current = ref(0);
// const isNext = computed(() => hotLottery.value.length - (current.value + 1) * 4 > 0);
// const isPre = computed(() => current.value !== 0);
</script>
<style lang="scss" scoped>
/* stylelint-disable */
.lottery-wrap {
  padding-bottom: 80px;
  width: 100%;
  background-size: 100% auto;
  background-position: 0 -450px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .hot-lottery-wrap {
    margin-top: 80px;
    width: 1200px;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;

      .title-wrap {
        font-size: 24px;
        color: var(--font-color-333);

        .svg-icon {
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
      }

      .arrow-wrap {
        display: flex;
        align-items: center;

        div {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--font-color-fff);
          cursor: pointer;

          &.disabled {
            pointer-events: none;
            cursor: not-allowed;
          }

          &:first-child {
            margin-right: 15px;
          }
        }
      }
    }

    .lottery-scroll {
      display: flex;
      width: 100%;
      flex-wrap: wrap;

      .lottery-item {
        height: 230px;
        position: relative;

        &:not(:nth-child(4n)) {
          margin-right: 10px;
          margin-bottom: 13px;
        }

        .el-image {
          width: 290px;
          height: 160px;
          border-radius: 0;
          background-color: transparent;
          flex-shrink: 0;
          overflow: hidden;
        }

        .footer {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 70px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding: 0 14px;
          background-color: var(--bg-color-282828);
          justify-content: space-between;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;

          .el-button {
            width: 120px;
            min-height: 36px;

            &:hover {
              background-color: var(--theme-color) !important;
              color: var(--font-color-fff) !important;
            }
          }

          span {
            color: var(--font-color-333);
            font-size: 16px;
          }
        }
      }
    }
  }

  .lottery-body {
    width: 1200px;
    margin-top: 50px;
  }

  .el-image {
    width: 100%;
    height: 100%;
  }

  .lottery-body {
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
