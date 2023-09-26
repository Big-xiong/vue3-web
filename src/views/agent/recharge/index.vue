<template>
  <div class="recharge-wrap-main">
    <header>{{ $t(`充值`) }}</header>
    <div class="recharge-wrap">
      <div class="recharge-wrap-top">
        <div>
          <svg-icon name="keyongedu" />
          <span class="recharge-wrap-tip">{{ $t('账户总金额') }}</span>
        </div>
        <p v-money="Number(agent.userInfo?.money || '0') + Number(agent.userInfo?.commission_money || '0')"></p>
      </div>
      <div class="recharge-wrap-top">
        <div>
          <svg-icon name="keyongedu" />
          <span class="recharge-wrap-tip">{{ $t('可用余额') }}</span>
        </div>
        <p v-money="agent.userInfo?.money"></p>
      </div>
      <div class="recharge-wrap-top">
        <div>
          <svg-icon name="keyongedu" />
          <span class="recharge-wrap-tip">{{ $t('佣金') }}</span>
        </div>
        <p v-money="agent.userInfo?.commission_money"></p>
      </div>
    </div>
    <Payment
      hideKefu
      hideOperation
      isAgent
    />
  </div>
</template>

<script setup>
import { inject } from 'vue';
import Payment from '@/components/Payment/index.vue';

const global = inject('global');
const { agent } = global.$store.state;
</script>

<style lang="scss" scoped>
.recharge-wrap-main {
  border: 1px solid var(--block-border-color);
  background-color: var(--block-bg-color);
  margin-top: 20px;
  padding: 30px;
  text-align: left;
  border-radius: 6px;
  box-sizing: border-box;

  header {
    font-weight: 600;
    font-size: 20px;
    color: var(--font-color-000);
    margin: 0 0 20px;
    text-align: left;
  }
}

.recharge-wrap {
  &-top {
    border-radius: 6px;
    border: 1px solid var(--border-color-e2e2e2);
    border-radius: 6px;
    box-sizing: border-box;
    display: inline-block;
    padding: 15px 20px 0;
    margin: 0 15px 20px 0;

    > div {
      span {
        color: var(--font-color-999);
        font-size: 14px;
      }

      .svg-icon {
        color: var(--theme-color) !important;
        width: 19px;
        height: 19px;
      }
    }

    > p {
      font-size: 20px;
      color: var(--font-color-000);
      margin: 8px 0 0 0;
    }
  }

  &-tip {
    margin-left: 10px;
  }
}

:deep(.deposit .form-ul li .amount) {
  width: 450px;
}
</style>
