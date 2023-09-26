<template>
  <div
    class="app-header-logo"
    @click="$router.push({ path: '/' })"
  >
    <!-- <img
      src="/src/assets/images/header/logo.png"
      alt=""
    /> -->
    <img
      :src="dicts?.siteinfo?.logo ?? $getSrc('/src/assets/images/header/logo.png')"
      alt="logo"
      @click="$router.push('/')"
      class="logo"
    />
  </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue';

const $store = inject('store');
const { app: { dicts } } = $store.state;
</script>

<style lang="scss" scoped>
.app-header-logo {
  img {
    height: 87px;
    cursor: pointer;
  }
}
</style>
