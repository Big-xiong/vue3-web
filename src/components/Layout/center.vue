
<template>
  <div class="center-layout-wrap">
    <div class="align-center-wrap-1200">
      <div class="center-layout-wrap-left">
        <Nav />
      </div>
      <div class="center-layout-wrap-right">
        <router-view v-slot="{ Component, route }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component
              v-bind="route.meta"
              :key="route.name"
              :is="Component"
            />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import Nav from '@/views/center/components/Nav.vue';
</script>

<style lang="scss" scoped>
.center-layout-wrap {
  padding: 20px 0;
  text-align: left;
  width: 100%;

  .align-center-wrap-1200 {
    display: flex;
    justify-content: space-between;
  }

  &-left {
    width: 180px;
  }

  &-right {
    width: 1000px;
    min-height: 500px;
    border-radius: 10px;
  }
}
</style>
