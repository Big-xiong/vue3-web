<template>
  <div
    class="esport-wrap"
    :style="{ 'background-image': `url(${$getSrc('/src/current_project/assets/images/image_banner_bk.png')})` }"
  >
    <SubBanner id="8" />
    <div class="main-center-wrap">
      <div class="layout-flex-center esport-wrap-list">
        <div
          v-for="(item, index) in games"
          :key="index"
          class="esport-wrap-item"
          v-login
          @click="$playGame(item, 8)"
        >
          <el-image :src="games[index]?.page_pic"></el-image>
          <el-button
            class="game-button"
            v-loadingBtn="games[index]?.page_pic"
            v-game-status|img="$getGameStatus(games[index], 8, 2)"
          >{{ $t("立即游戏") }}
          </el-button>
        </div>
      </div>

      <div class="esport-wrap-hotList">
        <header>
          <SvgIcon name="thumb_up" />
          <span>{{ $t('热门游戏') }}</span>
        </header>
        <div class="hot-wrap">
          <div
            v-for="(item, index) in esportPlatforms.gameLists"
            :key="index"
            v-show="index < 8"
          >
            <el-image
              class="middle"
              :src="$getSrc(item.pic)"
            />
            <p v-loadingBtn="$getSrc(item.pic)">{{ item.title }}</p>
            <div
              class="shadow"
              v-game-status|img="$getGameStatus(item, 8, 2)"
            >
              <div>{{ item.title }}</div>
              <el-button
                type="primary"
                v-login
                @click="$playGame(item, 8)"
              >{{ user.isLogin ? $t("立即游戏") : $t("立即投注") }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject, computed, watch } from 'vue';
import SubBanner from '@/components/Banner/sub.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import esportPlatforms from './data';

const $store = inject('store');
const { user } = $store.state;
const games = computed(() => $store.state.game?.platformGameIdsv3[8]);
</script>
<style lang="scss" scoped>
/* stylelint-disable */
.esport-wrap {
  padding-bottom: 80px;
  width: 100%;
  background-size: 100% auto;
  background-position: 0 -450px;
  box-sizing: border-box;
  overflow: hidden;

  &-list {
    margin-top: 50px;
    flex-wrap: wrap;
    position: relative;
    box-sizing: border-box;
    justify-content: space-between;

    .esport-wrap-item {
      background-size: 100% auto;
      background-position: center center;
      transition: all 0.45s ease-out;
      image-rendering: -webkit-optimize-contrast;
      background-repeat: no-repeat;
      margin-bottom: 0;
      cursor: pointer;

      .el-image {
        width: 100%;
        height: 100%;
      }
    }

    p {
      margin: 0;
    }

    >div {
      position: relative;
      width: 592px;
      height: 240px;
      border-radius: 4px;
      margin-bottom: 12px;
      box-sizing: border-box;

      .game-button {
        position: absolute;
        bottom: 36px;
        left: 40px;
      }
    }
  }

  &-hotList {
    header {
      display: flex;
      align-items: center;
      padding: 0 15px;
      color: var(--font-color-333);
      margin-top: 80px;
      margin-bottom: 30px;

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

    .hot-wrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      >div {
        cursor: pointer;
        margin: 0 0 30px 0;
        position: relative;
        width: 270px;
        height: 380px;

        .el-image {
          display: block;
          width: 100%;
          height: 100%;
        }

        >p {
          position: absolute;
          width: 100%;
          text-align: center;
          color: var(--font-color-fff);
          bottom: 15px;
          left: 0;
          font-size: 16px;
          line-height: 22px;
          margin: 0;
        }

        >.shadow {
          display: none;
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background: var(--bg-color-00008);
          border-radius: 4px;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          div {
            color: var(--font-color-fff);
            font-size: 20px;
            margin-bottom: 20px;
          }

          .el-button {
            border-radius: 2px !important;
            min-height: 38px !important;
            height: 38px !important;
            padding-top: 0;
            padding-bottom: 0;
            line-height: 36px;
            border-radius: 6px !important;
            width: 110px;
            font-size: 14px !important;

            &:hover {
              background-color: var(--theme-color) !important;
              color: var(--font-color-fff) !important;
            }
          }
        }

        &:hover {
          p {
            display: none;
          }

          >.shadow {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
