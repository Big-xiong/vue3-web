<template>
  <div class="home-wrap">
    <BannerMove />
    <GameList />
    <HotGame />
    <Downapp />
    <first-website-info />
  </div>
</template>

<script setup>
import {
  inject,
  ref,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import FirstWebsiteInfo from '@current/views/index/home/components/FirstWebsiteInfo.vue';
import { indexbanner } from '@/api/home';
import GameList from './components/GameList.vue';
import HotGame from './components/HotGame.vue';
import Downapp from './components/Downapp.vue';
import BannerMove from './components/BannerMove.vue';

const global = inject('global');
const { data: bannerList } = useRequest(indexbanner);
</script>

<style lang="scss" scoped>
</style>
