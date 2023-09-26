<template>
  <Dialog
    v-model="modelValue"
    :title="$t('温馨提示')"
    center
    titlePadding="40px 0 0"
    contentPadding="0 40px"
    :footerStyle="{ padding: '0 0 20px' }"
    confirmType="grey"
    :confirmText="$t('进入旁观')"
    @onConfirm="goPlay"
    @onClose="close => {
      $router.push({ name: 'centerDeposit' })
      close()
    }"
    cancelType="primary"
    :cancelText="$t('立即充值')"
    footerBtnWidth="200px"
  >
    <div id="moneyPop">
      <div class="center">
        <p class="note">{{ $t('您账户余额不足是否进入游戏') }}</p>
        <ul class="table">
          <li>
            <p>{{ $t('中心钱包') }}</p>
            <p>{{ $t('游戏额度') }}</p>
            <!-- <p>{{$t('理财钱包')}}</p> -->
          </li>
          <li>
            <p v-money="walletInfo.money"></p>
            <p v-money="walletInfo.all_platform_money"></p>
          </li>
        </ul>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import {
  inject, getCurrentInstance,
} from 'vue';
import { createSocket, onCloseWS } from '@/plugins/socket';
// import { autotrans } from '@/api/channel';
import Dialog from './index.vue';

const global = inject('global');
const $store = inject('store');
const token = localStorage.getItem('access_token');

const { attrs } = getCurrentInstance();

const { walletInfo } = $store.state.user;

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

function goPlay(close) {
  const routeUrl = global.$router.resolve({
    // path: '/play',
    name: 'gamePlay',
    query: {
      game_id: attrs.gameId,
      platform_id: attrs.platformId,
      cate_id: attrs.cateId,
      at: attrs.at,
    },
  });
  window.open(routeUrl.href, 'gamePlayWin');
  // openUrl(routeUrl.href)
  close();
}
</script>

<style lang="scss">
#moneyPop {
  .center {
    > p {
      text-align: center;
      color: var(--font-color-ccc);
      font-size: 14px;
      line-height: 20px;
    }

    > .table {
      margin-top: 20px;
      width: 100%;
      border-top: 1px solid var(--border-color-000-1);
      border-left: 1px solid var(--border-color-000-1);

      > li {
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        color: var(--font-color-333);
        display: flex;

        > p {
          text-align: center;
          border-right: 1px solid var(--border-color-000-1);
          border-bottom: 1px solid var(--border-color-000-1);
          display: block;
          width: 50%;
          margin: 0;
        }

        &:first-child {
          > p {
            background-color: var(--theme-color);
            color: var(--font-color-fff);

            &:not(:last-child) {
              border-right: 1px solid var(--border-color-000-1);
            }
          }
        }
      }
    }
  }
}
</style>
