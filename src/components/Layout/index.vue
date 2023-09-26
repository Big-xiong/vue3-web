<template>
  <!-- <Header /> -->
  <router-view v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />
    </Suspense>
  </router-view>
  <!-- <Footer /> -->
</template>

<script setup>
// import Header from './header/index.vue';
// import Footer from './footer/index.vue';
</script>

<style lang="scss" scoped>
</style>
