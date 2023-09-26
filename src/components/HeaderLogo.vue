<template>
  <div class="header-logo" v-loading="!dicts?.siteinfo?.logo" @click="$router.push({ path: '/' })" v-bind="$attrs"
    :style="{ backgroundImage: `url(${dicts?.siteinfo?.logo})`, ...($attrs.style ?? { width, height }) }">
  </div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: '100px',
  },
  height: {
    type: String,
    default: '37px',
  },
});
const $store = inject('store');
const { dicts } = $store.state.app;
</script>

<style lang="scss" scoped>
.header-logo {
  background: no-repeat center;
  background-size: contain;
}
</style>
