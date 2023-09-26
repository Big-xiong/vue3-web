
<template>
  <router-view
    v-slot="{ Component, route }"
    v-if="isLanding"
  >
    <transition
      name="fade"
      mode="out-in"
    >
      <component
        :key="route.name"
        :is="Component"
      />
    </transition>
  </router-view>
  <div
    class="center-layout-wrap"
    v-else
  >
    <div class="align-center-wrap-1200">
      <div class="center-layout-wrap-left">
        <Nav />
      </div>
      <div class="center-layout-wrap-right agent-center-layout-wrap-right">
        <AgentHeader />
        <router-view v-slot="{ Component, route }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component
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
import {
  inject, ref, watch, onMounted,
} from 'vue';
import { useRoute } from 'vue-router';
import AgentHeader from '@/views/agent/components/AgentHeader.vue';
import Nav from '@/views/agent/components/Nav.vue';
const global = inject('global');
const route = useRoute();
const isLanding = ref(route.name === 'agentLanding');
watch(
  () => route.name,
  (name) => {
    isLanding.value = (name === 'agentLanding');
  },
);
onMounted(() => {
  // 执行stop（）请求慎重 agent 登录跳转会有问题
  // stop();
});
</script>

<style lang="scss" scoped>
.center-layout-wrap {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  margin-top: -17px;
  .align-center-wrap-1200 {
    display: flex;
    justify-content: space-between;
  }
  &-left {
    width: 240px;
  }
  &-right {
    width: 960px;
    min-height: 500px;
  }
}
</style>
