<template>
  <div class="layout agent-bg-top">
    <div class="agent-content">
      <!-- <el-button
        type="primary"
        class="add"
        @click="isShowLogin = true"
      >{{
        $t("加入我们")
      }}</el-button> -->
      <el-button
        type="primary"
        class="add"
        @click="$router.push({name: 'agentHome'})"
        v-if="Cookies.get('agent_access_token')"
      >{{$t('代理中心')}}</el-button>
      <el-button
        v-else
        type="primary"
        class="add"
        @click="showDialog(1)"
      >{{$t(`加入我们`)}}</el-button>
    </div>
    <!-- <LoginModal
      v-model:isShow="isShowLogin"
      :type="loginTarget"
      @onCancel="isShowLogin = false"
    /> -->
  </div>
</template>

<script setup>
import {
  inject, onMounted, reactive, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import Cookies from 'js-cookie';
// import LoginModal from '../components/LoginModal.vue';

const isShowLogin = ref(false);
const global = inject('global');
const tipsData = reactive([
  {
    title: global.$t('高能返佣'),
    pic: '/src/assets/images/landing/gnfy.png',
  },
  {
    title: global.$t('最优质的品质'),
    pic: '/src/assets/images/landing/yzpz.png',
  },
  {
    title: global.$t('丰富的游戏支持'),
    pic: '/src/assets/images/landing/yxzc.png',
  },
]);

const loginTarget = ref('login');

const route = useRoute();

function showDialog() {
  global.$dialog({ tpl: 'LoginModalWq', type: 'register' });
}

</script>

<style scoped lang="scss">
.agent-bg-top {
  width: 100%;
  height: 898px;
  background: var(--bg-color-1d153d) url('@img/agentLanding/brand-rion.jpg') center top no-repeat;
  background-size: cover;

  .agent-content {
    height: 100%;
    position: relative;

    .add {
      min-width: 240px;
      height: 80px;
      text-align: center;
      border-radius: 6px;
      font-size: 24px !important;
      cursor: pointer;
      position: absolute;
      top: 695px;
      left: 50%;
      transform: translate3d(-400px, 0, 0);
    }
  }
}
</style>
