<template>
  <div class="fishing">
    <!-- <Banner :src="bannerUrl" /> -->
    <SubBanner id="3" />
    <div class="fishing-main align-center-wrap">
      <div class="fishing-main-inner">
        <h1 class="fishing-main-inner-title">{{ $t(`平台`) }}</h1>
        <Table :list="list" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import Banner from '@/components/Banner/index.vue';
import Table from './components/Table.vue';
import SubBanner from '@/components/Banner/sub.vue';

const global = inject('global');

const bannerUrl = '/src/assets/images/fishing/banner.png';
const list = [
  {
    title: global.$t(`AG捕鱼`),
    description: global.$t(`顶级渔场一炮致富`),
    img: '/src/assets/images/fishing/1.png',
    default_game_id: 12,
    game_platform_id: 1,
    name: 'AG',
  },
  // {
  //   title: global.$t(`PP捕鱼`),
  //   description: global.$t(`简易上手，一炮而红`),
  //   img: '/src/assets/images/fishing/2.png',
  //   default_game_id: 12,
  //   game_platform_id: 1,
  //   name: '',
  // },
  // {
  //   title: global.$t(`SA捕鱼`),
  //   description: global.$t(`打鱼利器一手掌握`),
  //   img: '/src/assets/images/fishing/3.png',
  //   default_game_id: 12,
  //   game_platform_id: 1,
  //   name: '',
  // },
];
</script>

<style lang="scss">
.fishing {
  &-main {
    &-inner {
      width: 1122px;
      margin: 64px auto;

      &-title {
        margin-bottom: 18px;
        font-size: 19px;
        font-weight: 700;
        text-align: left;
        color: var(--font-color-000);
        line-height: 28px;
        letter-spacing: 0px;
      }
    }
  }
}
</style>
