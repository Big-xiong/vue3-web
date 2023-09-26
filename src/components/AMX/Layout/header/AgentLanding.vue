<template>
  <div class="agent-landing-header-wrap">
    <div class="inner-wrap">
      <div
        @click="$router.push({ path: '/' })"
        class="left-logo-wrap"
      >
        <img
          class="logo"
          alt
          :src="dicts?.siteinfo?.logo ?? $getSrc('/src/assets/images/header/logo.png')"
        />
      </div>
      <div class="right-logo">
        <img
          src="@img/agentLanding/picdaili1.png"
          alt
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue';

const $store = inject('store');
$store.dispatch('app/getDict', ['siteinfo']);
const { dicts } = $store.state.app;

const siteInfo = ref({});

watch(() => dicts.siteinfo, (info) => {
  siteInfo.value = info;
});
</script>

<style scoped lang="scss">
.agent-landing-header-wrap {
  height: 90px;
  background-color: var(--lading-head-bg);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  border-bottom: 2px solid var(--theme-color);

  .inner-wrap {
    width: 1200px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    align-items: center;
    height: 100%;
  }

  .center-logo .logo {
    height: 55px;
  }

  .left-logo-wrap {
    display: flex;
    height: 100%;
    align-items: center;

    .logo {
      height: 76px;
      cursor: pointer;
    }
  }

  .right-logo {
    height: 100%;

    img {
      height: 100%;
    }
  }
}
</style>
