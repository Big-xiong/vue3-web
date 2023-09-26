<template>
  <div class="fish-wrap">
    <SubBanner id="3" />
    <div
      class="fish-body"
      :style="{ 'background-image': `url(${$getSrc('/src/current_project/assets/images/image_banner_bk.png')})` }"
    >
      <div class="game-wrap">
        <div
          class="game-item"
          v-for="(item, index) in games"
          :key="index"
          @click="$playGame(item)"
        >
          <el-image
            class="middle"
            :src="item?.page_pic"
          ></el-image>
          <el-button
            class="game-button"
            v-game-status|img="$getGameStatus(games[index], 3, 2)"
          >{{
              $t("立即游戏")
          }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject, computed, onMounted } from 'vue';
import SubBanner from '@/components/Banner/sub.vue';

const $store = inject('store');
const games = computed(() => $store.state.game?.platformGameIdsv3[3].slice(0, 2) ?? []);

onMounted(() => console.log(games));
</script>
<style lang="scss" scoped>
/* stylelint-disable */
.fish-wrap {
  width: 100%;
  background-position: 50%;
  background-repeat: no-repeat;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;

  .fish-body {
    display: flex;
    flex: 1;
    background-size: cover;
    flex-direction: column;
    align-items: center;
    padding-top: 70px;
    padding-bottom: 80px;
  }

  .el-image {
    width: 100%;
    height: 100%;
  }

  .game-wrap {
    display: flex;
    width: 1200px;
    align-items: center;
    justify-content: space-between;
  }

  .game-item {
    width: 585px;
    height: 250px;
    position: relative;

    .game-button {
      left: 40px;
      top: 174px;
    }
  }
}
</style>
