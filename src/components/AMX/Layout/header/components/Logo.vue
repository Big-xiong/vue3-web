<template>
  <div class="app-header-logo">
    <div class="layout-flex-center align-center-wrap-1200">
      <div
        class="app-header-logo-main"
        @click="$router.push({ path: '/' })"
        :style="{'background-image': `url(${dicts?.siteinfo?.logo ?? $getSrc('/src/assets/images/header/logo.png')})`}"
      >
        <!-- <img
          :src="dicts?.siteinfo?.logo ?? $getSrc('/src/assets/images/header/logo.png')"
          alt="logo"
          @click="$router.push('/')"
          class="logo"
        /> -->
      </div>
      <Nav />
      <User />
    </div>
  </div>
</template>
<script setup>
import { inject } from 'vue';
import User from './User.vue';
import Nav from './Nav.vue';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;

</script>
<style lang="scss" scoped>
.app-header-logo {
  height: 100px;
  position: relative;
  background-color: var(--header-nav-bg-color);

  .logo {
    width: 110px;
  }

  .align-center-wrap-1200 {
    height: 100%;
    justify-content: space-between;
  }

  &-join {
    color: var(--font-color-666);
    justify-content: flex-start;

    img {
      cursor: pointer;
      height: 76px;
      zoom: 0.5;
      margin-right: 15px;
    }

    span {
      cursor: pointer;
    }
  }

  &-main {
    text-align: center;
    margin-right: 20px;
    cursor: pointer;
    height: 100%;
    width: 80px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
