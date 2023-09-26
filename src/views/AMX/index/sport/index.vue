<template>
  <div
    class="sport-wrap"
    :style="{ 'background-image': `url(${$getSrc('/src/current_project/assets/images/image_banner_bk.png')})` }"
  >
    <SubBanner id="4" />
    <div class="main-center-wrap">
      <div class="layout-flex-center sport-wrap-list">
        <div
          v-for="(item, index) in games"
          :index="index"
          :key="index"
          class="sport-wrap-item"
          v-login
          @click="$playGame(item, 4, index)"
        >
          <el-image
            class="middle"
            :src="games[index]?.page_pic"
          ></el-image>
          <div class="layout-flex-center title"></div>

          <el-button
            class="game-button"
            v-loadingBtn="games[index]?.page_pic"
            v-login
            v-game-status|img="$getGameStatus(item, 4, 2)"
          >{{ $t('立即游戏') }}
          </el-button>
        </div>
      </div>

      <MatchList />

      <div class="layout-flex-center sport-wrap-hotList">
        <div
          v-for="(item, index) in sportPlatforms.gameLists"
          :key="index"
        >
          <el-image
            class="small"
            :src="$getSrc(item.pic)"
          />
          <p v-loadingBtn="$getSrc(item.pic)">{{ item.title }}</p>
          <div
            class="shadow"
            v-game-status|img="$getGameStatus(item, 4, 2)"
          >
            <div>{{ item.title }}</div>
            <el-button
              type="primary"
              v-login
              @click="$playGame(item, 4)"
            >{{ user?.isLogin ? $t("立即游戏") : $t("立即投注") }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject, computed, watch } from 'vue';
import SubBanner from '@/components/Banner/sub.vue';
import MatchList from './components/MatchList.vue';
import sportPlatforms from './data';

const $store = inject('store');
const { user } = $store.state;
const games = computed(() => $store.state.game?.platformGameIdsv3[4]?.slice(0, 2) ?? []);

</script>
<style lang="scss" scoped>
/* stylelint-disable */
.sport-wrap {
  padding-bottom: 80px;
  width: 100%;
  background-size: 100% auto;
  background-position: 0 -450px;
  box-sizing: border-box;
  overflow: hidden;

  :deep(.el-carousel__item) {
    width: 200px;
  }

  &-list {
    margin-top: 40px;
    flex-wrap: wrap;
    position: relative;
    box-sizing: border-box;
    justify-content: space-between;

    .sport-wrap-item {
      background-size: 100%;
      background-position: center center;
      background-repeat: no-repeat;
      image-rendering: -webkit-optimize-contrast;

      .el-image {
        height: 100%;
        width: 100%;
      }

      .game-button {
        position: absolute;
        left: 40px;
        bottom: 38px;
      }
    }

    p {
      margin: 0;
    }

    >div {
      position: relative;
      width: 585px;
      height: 250px;
      border-radius: 4px;
      background-size: 100% 100%;
      margin-bottom: 52px;
      box-sizing: border-box;
      cursor: pointer;

      >.title {
        text-align: left;
        font-size: 26px;
        font-weight: 500;
        color: var(--font-color-fff);
        line-height: 37px;
        margin: 0;
        justify-content: flex-start;

        img {
          margin-left: 10px;
          height: 27px;
        }
      }

      >.text {
        text-align: left;
        font-size: 16px;
        color: var(--font-color-fff);
        line-height: 22px;
        margin: 0;
      }

      >p:nth-child(2) {
        margin-top: 15px;
      }

    }
  }

  &-hotList {
    flex-wrap: wrap;
    justify-content: space-between;
    width: 1200px;
    margin-top: 42px;

    >div {
      cursor: pointer;
      margin: 0 0 12px 0;
      position: relative;
      width: 190px;
      height: 250px;

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
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: var(--bg-color-00008);
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
          padding-top: 0;
          padding-bottom: 0;
          line-height: 36px;
          font-size: 14px !important;

          &:hover {
            background-color: var(--theme-color) !important;
            color: var(--font-color-fff) !important;
          }
        }

        >span,
        a {
          display: block;
          position: absolute;
          width: 120px;
          height: 38px;
          background-color: var(--theme-color);
          left: 50%;
          top: 50%;
          margin-top: -19px;
          margin-left: -60px;
          color: var(--font-color-282828);
          font-size: 14px;
          cursor: pointer;
          text-align: center;
          line-height: 38px;
          border-radius: 2px;
        }
      }

      &:hover {
        >.shadow {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        p {
          display: none;
        }
      }
    }
  }
}
</style>
