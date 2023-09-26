<template>
  <LandingHeader v-if="isLanding" />
  <div
    v-else
    class="agent-header-wrap"
  >
    <div class="align-center-wrap-1200 layout-flex-between">
      <AgentLogo />
      <div class="user-info-wrap">
        <p
          class="layout-flex-center"
          @click="$openKefu"
        >
          <svg-icon name="zm@3x"></svg-icon>
          <span>{{ $t(`代理客服`) }}</span>
        </p>
        <i></i>
        <el-button
          size="small"
          @click="agentLogout"
        >{{ $t('退出') }}</el-button>
        <svg-icon
          class="svg-icon-touxiang"
          name="touxiang@3x"
        ></svg-icon>
        <span style="margin-right: 15px;">{{ agent.userInfo?.username || '' }}</span>
        <div lang-select />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AgentLogo from './components/AgentLogo.vue';
import LandingHeader from './AgentLanding.vue';

const $store = inject('store');
const { agent } = $store.state;
const global = inject('global');
const route = useRoute();

const isLanding = ref(route.name === 'agentLanding');

watch(
  () => route.name,
  (name) => {
    isLanding.value = (name === 'agentLanding');
  },
);

const router = useRouter();
function agentLogout() {
  $store.dispatch('agent/logout').then(() => {
    global.$router.push('/affiliate');
  });
}

</script>

<style lang="scss" scoped>
.agent-header-wrap {
  height: 100px;
  background-color: var(--agent-header-bg-color);
  margin-bottom: calc(0px - var(--header-height));

  .align-center-wrap-1200 {
    height: 100%;
  }

  .user-info-wrap {
    display: flex;
    align-items: center;

    p {
      font-size: 13px;
      color: var(--font-color-ccc);
      margin: 0;
      margin: 0 20px 0 0;
      cursor: pointer;

      img {
        width: 17px;
        margin-right: 5px;
      }
    }

    .el-button {
      min-height: 30px !important;
      padding-top: 0;
      padding-bottom: 0;
      font-size: 12px !important;
    }

    :deep(.el-image) {
      width: 30px;
      height: 30px;
      margin: 0 15px;
    }

    span {
      color: var(--font-color-fff);
    }

    i {
      width: 1px;
      height: 12px;
      opacity: 1;
      background: var(--bg-color-525152);
      border-radius: 1px;
      margin-right: 20px;
    }
    :deep(.svg-icon) {
      width: 17px;
      height: 17px;
    }
    .svg-icon-touxiang {
      width: 30px;
      height: 30px;
      margin: 0 15px;
      fill: var(--theme-color) !important;
    }
  }
}
</style>
