<template>
  <div class="total-money-wrap">
    {{ $t('游戏总额度') }}
    <span v-money="totalMoney" />，
    {{ $t('请先回收至中心钱包，方可取款') }}<a @click="help">{{ $t('一键回收') }}</a>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';

const global = inject('global');
const $store = useStore();

const totalMoney = computed(() => {
  const { all_platform_money } = $store.state.user.walletInfo;
  return all_platform_money ?? 0;
});

function help() {
  global.$dialog({
    tpl: 'TipsDialog',
    icon: false,
    tipsTitle: $t('温馨提示'),
    tips: global.$t('确定是否转回游戏内的额度至中心钱包?'),
    confirmText: global.$t('确定'),
    cancelText: global.$t('取消'),
    close: () => { },
    onClose: (close) => close(),
    onConfirm: async (close) => {
      await $store.dispatch('game/backTransAll').then(() => {
        close();
        global.$message.success(global.$t('收回余额成功'));
        $store.dispatch('user/getWalletInfo');
      });
    },
  });
}

</script>

<style lang="scss" scoped>
.total-money-wrap {
  color: var(--font-color-606060);
  text-transform: uppercase;
  font-size: 14px;

  span,
  a {
    color: var(--theme-color);
  }

  a {
    margin-left: 10px;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
