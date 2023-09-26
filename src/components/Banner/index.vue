<template>
  <div class="banner">
    <!-- <img width="100%" :src="src" /> -->
    <div class="img aaa" :style="`background-image: url(${$getSrc(src, defaultSrc)});`"></div>
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    default: '',
  },
  defaultSrc: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss">
// 竞品 https://www.fun88asia.com/cn/error/404.htm
.banner {
  .img {
    height: 372px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
