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
import LeftNav from './LeftNav.vue';

</script>

<style lang="scss" scoped>
.help-wrap {
  display: flex;
  width: 1200px;
  padding: 30px 0 30px 30px;

  &-right {
    min-height: 500px;
    flex: 1;
    border-radius: 6px;
  }
}
</style>
