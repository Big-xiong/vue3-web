<template>
  <div class="agent-nav-wrap">
    <div
      class="menu-list"
      v-for="(item, head) in menuData"
      :key="item.parent"
    >
      <div
        class="menu-header"
        v-if="head !== 'none'"
      >{{ $t(head) }}</div>
      <template
        v-for="(subMenu, index) in item"
        :key="index"
      >

        <div
          class="menu-item"
          @click="goPage(subMenu)"
          :class="{ active: routeName === subMenu.name,hide: (subMenu.name === 'agentMemberRegister' && agent?.userInfo?.spread_switch !== 2) || (subMenu.name === 'agentRecharge' && agent?.userInfo?.deposit_switch !== 2)}"
        >
          <svg-icon :name="subMenu.icon" />
          <span>{{ $t(subMenu.meta.title) }}</span>
        </div>
      </template>

      <div class="divider"></div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, computed, watch, watchEffect, ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import createCenterRouter from '@/router/modules/agent';

const centerRouter = createCenterRouter();
const global = inject('global');
const $router = useRouter();
const $store = inject('store');
const { agent } = $store.state;

const route = useRoute();
const routeName = computed(() => route.name);
const menuData = ref({});
const routerMap = centerRouter[0].children ?? [];

routerMap.forEach((item) => {
  if (item.meta && item.meta.parent) {
    const { parent } = item.meta;
    if (!menuData.value[parent]) {
      menuData.value[parent] = [];
    }

    menuData.value[parent].push({
      name: item.name,
      icon: item.path,
      meta: item.meta,
    });
  }
});

function goPage({ name }) {
  $router.push({ name });
}
</script>

<style lang="scss" scoped>
.agent-nav-wrap {
  width: 220px;
  background-color: var(--block-bg-color);
  margin-bottom: 20px;
  border-radius: 6px;
  padding: 25px 0 20px;
  box-sizing: border-box;

  .menu-list {
    text-align: left;
    cursor: pointer;
    border-top: solid 1px var(--dark-bg-color-232323, var(--border-color-e2e2e2));
    // padding-bottom: 10px;

    &:first-of-type {
      border-top: none;
    }

    .divider {
      height: 1px;
      background-color: var(--border-color-e2e2e2);
      margin: 10px 15px 0;
      // opacity: 0.4;
    }

    &:last-of-type .divider {
      display: none;
    }

    .menu-header {
      line-height: 48px;
      color: var(--font-color-43535d);
      font-size: 12px;
      padding: 0 15px 0 30px;
    }

    .menu-item {
      font-size: 16px;
      height: 48px;
      display: flex;
      color: var(--font-color-222930);
      padding-left: 15px;
      display: flex;
      align-items: center;

      &.active,
      &:hover {
        color: var(--theme-color);
        background-color: var(--bg-color-f7f7f7);

        .svg-icon {
          fill: var(--theme-color) !important;
        }
      }

      &.hide {
        display: none;
      }

      .svg-icon {
        display: inline-block;
        margin-right: 13px;
        fill: var(--agent-nav-svg-fill) !important;
      }
    }
  }
}
</style>
