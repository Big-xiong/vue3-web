<template>
  <div
    class="app-header-logo"
    @click="$router.push({ path: '/' })"
  >
    <img
      src="/src/assets/images/header/logo.png"
      alt=""
    />
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.app-header-logo {
  img {
    height: 32px;
    cursor: pointer;
  }
}
</style>
