<template>
  <div class="site-alert">
    <el-dialog
      v-model="levelUpVisible"
      :show-close="false"
      custom-class="level-up-dialog"
      center
      width="330px"
      :close-on-click-modal="false"
    >
      <template v-if="user?.userInfo && levelMaps">
        <div
          class="layout-flex-center level-box"
          :style="{'flex-direction': 'column','background-image':`url(${$getSrc(`/src/assets/images/site-alert/bg@3x.png`)})`}"
        >
          <img
            :src="$getSrc(`/src/assets/images/site-alert/V${user?.userInfo?.level}@3x.png`)"
            class="level-icon"
          />
          <div class="text">
            <h2>{{$t('恭喜您')}}</h2>
            <p>{{$t('升级到')}}{{levelMaps[user?.userInfo?.level]?.name??''}}</p>
          </div>
          <div
            class="layout-flex-between quicks"
            justify-space-between
          >
            <div class="item">
              <img src="@/assets/images/site-alert/icon1.png" />
              <p>
                {{$t('更多')}}
                <br />
                {{$t('专属福利')}}
              </p>
            </div>
            <div class="item">
              <img src="@/assets/images/site-alert/icon2.png" />
              <p>
                {{$t('更高')}}
                <br />
                {{$t('洗码比例')}}
              </p>
            </div>
            <div class="item">
              <img src="@/assets/images/site-alert/icon3.png" />
              <p>
                {{$t('更多')}}
                <br />
                {{$t('线下体验')}}
              </p>
            </div>
          </div>
        </div>
        <img
          src="@/assets/images/site-alert/close@3x.png"
          class="close pointer"
          @click="onClose"
        />
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, onMounted, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { memberupdatetips, readmessage } from '@/api/center';

const global = inject('global');
const $store = inject('store');
const { app: { dicts }, user } = $store.state;
const levelUpVisible = ref(false);
const globalAlertMaps = {
  1: global.$t('修改登录密码成功'),
  2: global.$t('修改资金密码成功'),
  3: global.$t('余额充值到账成功'),
  4: global.$t('充值审核被拒'),
  5: global.$t('提现出款操作成功'),
  6: global.$t('提现审核被拒'),
  7: global.$t('红利发放成功'),
  8: global.$t('人工推送站内信'),
  9: global.$t('会员升级通知'),
  10: global.$t('线下充值申请'),
  11: global.$t('充值失败'),
  12: global.$t('提款申请'),
  13: global.$t('注册礼金发放'),
  14: global.$t('修改资料成功'),
  15: global.$t('账户登录通知'),
  16: global.$t('充值红包发放'),
  17: global.$t('系统余额扣减'),
  18: global.$t('会员降级'),
  20: global.$t('游戏平台'),
  21: global.$t('货币切换'),
};

const levelMaps = ref(null);

const updatetips = ref(null);
const timeout2 = ref(8 * 1000);
const timeout = ref(10 * 1000);
function onClose() {
  updatetips.value && updatetips.value.id && readmessage({
    id: updatetips.value.id,
  }).then(() => {
    $store.dispatch('user/getUserInfo');
  });
  levelUpVisible.value = false;
}
const { run, cancel } = useRequest(memberupdatetips, {
  pollingInterval: timeout.value,
  onSuccess(res) {
    updatetips.value = res;
    if (!res || res.switch) {
      return;
    }
    const { type, content } = res;
    // VIP升级提示
    if (type === 9) {
      $store.dispatch('user/getUserInfo');
      $store.dispatch('app/getDict', 'memberlevellist').then((child) => {
        const levels = {};
        child.forEach((val) => {
          const { level, name } = val;
          levels[level] = {
            level,
            name,
          };
        });
        levelMaps.value = levels;
      });
      levelUpVisible.value = true;
    } else {
      let notifyType = 'success';
      if ([4, 6, 11, 18].indexOf(type) !== -1) {
        notifyType = 'error';
      }
      // 资金相关的，需要调用钱包接口
      if ([3, 5, 7, 13, 16].indexOf(type) !== -1) {
        global.$store.dispatch('user/getWalletInfo');
      }
      // // 资料相关的需要调用个人信息接口
      // if ([3, 5, 7, 13, 16].indexOf(type) !== -1) {
      //   this.getWallet()
      // }
      if ((type === 20 && !isGameAlert) || type !== 20) {
        if (res.content.indexOf(global.$t('红包雨')) === -1) {
          global.$notify({
            title: `${globalAlertMaps[type]}${global.$t('提示')}`,
            dangerouslyUseHTMLString: true,
            message: content,
            duration: timeout2.value,
            type: notifyType,
            onClose: () => {
              onClose();
              if (type === 20) {
                window.sessionStorage.setItem('wanquGameAlert', type);
              }
            },
          });
        }
      }
      // global.$store.dispatch('user/getUserInfo');
    }
    $store.dispatch('user/getUserInfo');
  },
});

watch(() => user.isLogin, (res) => {
  console.log('logout', res);
  if (user.isLogin) {
    run();
  } else {
    cancel();
  }
});

</script>

<style lang="scss">
.level-up-dialog {
  background-color: transparent !important;
  box-shadow: none !important;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0 !important;
    color: #574118;

    > .layout-flex-center {
      background-size: 100% auto;
      height: 378px;
      justify-content: flex-start;
      padding-top: 55px;
      box-sizing: border-box;
    }
  }

  .level-icon {
    width: 60px;
    margin-bottom: 10px;
  }

  .text {
    width: 100%;
    text-align: center;
    font-weight: 500;
    padding-top: 30px;
    padding-bottom: 30px;
    line-height: 1.5;
    color: var(--font-color-2b2b2b);
    h2 {
      font-size: 30px;
      margin: 0;
    }

    p {
      font-size: 24px;
      margin: 0;
    }
  }

  .quicks {
    width: 100%;
    font-size: 14px;
    line-height: 18px;
    padding: 0 20px;
    box-sizing: border-box;
    align-items: flex-start;

    .item {
      width: calc(100% / 3);
      text-align: center;
      color: var(--font-color-656565);

      p {
        margin: 0;
      }
    }

    img {
      width: 52px;
      margin-bottom: 10px;
    }
  }

  .bg {
    width: 100%;
  }

  .close {
    width: 60px;
    display: block;
    margin: 40px auto;
  }
}
</style>
