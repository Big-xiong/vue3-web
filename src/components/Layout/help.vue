<template>
  <div class="align-center-wrap help-wrap">
    <div class="center-layout-wrap-left">
      <LeftNav />
    </div>
    <div class="help-wrap-right">
      <router-view v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import LeftNav from '@/views/help/components/LeftNav.vue';
import Header from './header/index.vue';
import Footer from './footer/index.vue';
</script>

<style lang="scss" scoped>
.help-wrap {
  display: flex;
  width: 1200px;
  padding: 30px 0;
  min-height: 70vh;

  &-right {
    min-height: 500px;
    flex: 1;
    border-radius: 6px;
    // box-shadow: 0px 3px 15px 0px rgba(0, 34, 80, 0.1);
    // background-color: var(--dark-bg-color-191919, var(--bg-color-fff));
  }
}
</style>
