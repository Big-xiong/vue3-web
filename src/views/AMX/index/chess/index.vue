<template>
  <div
    class="chess-wrap"
    :style="{ 'background-image': `url(${$getSrc('/src/current_project/assets/images/image_banner_bk.png')})` }"
  >
    <SubBanner id="7" />
    <div class="chess-body">
      <div
        v-for="(_, index) in games.length"
        :index="index"
        :key="index"
        @click="$playGame(games[index])"
      >
        <el-image :class="{'middle': index > 0}" :src="games[index]?.page_pic"></el-image>
        <el-button
          class="game-button"
          v-login
          v-loadingBtn="games[index]?.page_pic"
          v-game-status|img="$getGameStatus(games[index], 7, 2)"
        >{{ $t('立即游戏') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, computed, ref, onMounted,
} from 'vue';
import SubBanner from '@/components/Banner/sub.vue';

const $store = inject('store');
const games = computed(() => $store.state.game?.platformGameIdsv3[7]);
</script>

<style lang="scss" scoped>
.chess-wrap {

  .chess-body {
    padding-top: 50px;
    display: flex;
    flex-wrap: wrap;
    width: 1200px;
    margin: 0 auto 80px auto;

    >div {
      position: relative;

      &[index="0"] {
        margin-bottom: 30px;
        height: 380px;
        width: 1200px;

        .game-button {
          left: 40px;
          top: 198px;
        }
      }

      &:not(:first-child) {
        width: 380px;
        height: 210px;

        .game-button {
          position: absolute;
          left: 20px;
          bottom: 71px;
        }
      }

      &[index="1"],
      &[index="2"] {
        margin-right: 30px;
      }

    }

    .el-image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
