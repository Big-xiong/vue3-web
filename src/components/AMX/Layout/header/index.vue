<template>
  <div :class="['app-header', { 'scrolled': isScrolled }]">
    <Top />
    <Logo />
  </div>
  <Login />
  <Suspension />
  <!-- <div
    class="home-event-entrance baccarat"
    v-if="routeName && (routeName === 'home' || routeName === 'real')"
  >
    <a
      class="btn"
      @click="$router.push('/baccarat')"
    >{{ $t('前往报名') }}</a>
  </div>-->
</template>

<script setup>
import {
  computed, onMounted, onBeforeUnmount, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import Login from '../../Login/index.vue';
import Top from './components/Top.vue';
import Logo from './components/Logo.vue';

import Suspension from './components/Suspension.vue';

const route = useRoute();
const routeName = computed(() => route.name);

const isScrolled = ref(false);

function handleScroll(e) {
  const scrollTop = window.pageYOffset
    || document.documentElement.scrollTop
    || document.body.scrollTop;
  isScrolled.value = scrollTop >= 200;
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<style lang="scss" scoped>
.app-header {
  background-color: var(--header-bg-color);
  z-index: 900;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  &.scrolled {
    border-bottom: 1px solid var(--theme-color);

    :deep(.app-header-top) {
      height: 0;
      opacity: 0;
      visibility: hidden;
    }

    > .middle {
      height: 50px;
    }
  }
}

.home-event-entrance {
  position: fixed;
  bottom: 60px;
  left: 10px;
  z-index: 9999;

  &.baccarat {
    width: 200px;
    height: 314px;
    background-image: url(/src/assets/images/baccarat/bg.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: contain;

    .btn {
      width: 130px;
      position: absolute;
      bottom: 35px;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
      color: var(--font-color-322924);
      font-size: 18px;
      font-weight: 600;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>
