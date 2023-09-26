<template>
  <div class="home-wrap">
    <BannerMove />
    <!-- <Banner /> -->
    <Advantage />
    <!-- 热门游戏 -->
    <HotGame />
    <!-- 我的优惠 -->
    <Benefit />
    <!-- app下载 -->
    <AppDownload />
    <!-- together -->
  </div>
</template>

<script setup>
import {
  reactive, ref, onMounted, inject,
} from 'vue';
import { useRoute } from 'vue-router';
// import { useSXO } from '@/utils/sxo';
import Advantage from './components/Advantage.vue';
import HotGame from './components/HotGame.vue';
import AppDownload from './components/AppDownload.vue';
import Benefit from './components/Benefit.vue';
import Banner from './components/Banner.vue';
import BannerMove from './components/BannerMove.vue';

const global = inject('global');
const route = useRoute();

onMounted(() => {
  if (route.query.isLogin === '1') {
    global.$dialog({ tpl: 'Login' });
  }
});
</script>

<style>
.home-wrap {
  min-height: calc(100vh - 107px);
}
</style>
