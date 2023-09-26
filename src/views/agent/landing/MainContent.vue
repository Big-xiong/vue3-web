<template>
  <div class="layout agent-bg-top">
    <div class="agent-content">
      <div class="add-agent">{{$t(`加入{0}合伙人`, [subConfig.title])}}</div>
      <div class="begin-success">{{$t('开启人生精彩时刻')}}</div>
      <div class="agent-tip">
        <div
          v-for="(list, index) in tipsData"
          :key="index"
        >
          <img
            :src="list.pic"
            alt
          />
          <span>{{ list.title }}</span>
        </div>
      </div>
      <el-button
        type="primary"
        class="add"
        @click="isShowLogin = true"
      >{{$t('加入我们')}}</el-button>
    </div>
    <LoginModal
      :isShow="isShowLogin"
      @onCancel="isShowLogin = false"
    />
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import LoginModal from '../components/LoginModal.vue';

const isShowLogin = ref(false);
const global = inject('global');
const subConfig = inject('subConfig');
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

if (location.href.includes('isLogin')) {
  isShowLogin.value = true;
}

</script>

<style lang="scss" scoped>
.agent-bg-top {
  width: 100%;
  height: 890px;
  background: url('/src/assets/images/landing/brand-rion.jpg') center top no-repeat;
  background-size: auto 100%;

  .agent-content {
    width: 1200px;
    height: 890px;
    margin: 0 auto;
    text-align: left;

    .add-agent {
      padding-top: 257px;
      font-size: 72px;
      color: var(--theme-color);
    }

    .begin-success {
      font-size: 50px;
      color: var(--theme-color);
      margin-top: 18px;
    }

    .agent-tip {
      margin-top: 74px;
      display: flex;
      margin-left: -70px;
      justify-content: flex-start;

      > div {
        width: 170px;
        margin-left: 50px;
        text-align: center;
        font-size: 24px;
        color: var(--font-color-ccc);
        display: flex;
        flex-direction: column;
        align-items: center;

        span {
          margin-top: 20px;
        }

        img {
          margin-bottom: 5px;
          width: 80px;
        }
      }
    }

    .add {
      width: 240px;
      height: 80px;
      text-align: center;
      border-radius: 2px;
      font-size: 30px;
      margin-top: 104px;
      cursor: pointer;
    }
  }

  .chashao {
    position: relative;

    .add {
      position: absolute;
      bottom: 20px;
      margin-left: -120px;
      left: 50%;
    }
  }
}
</style>
