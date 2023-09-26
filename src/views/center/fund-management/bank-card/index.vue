
<template>
      <div class="bank-card-wrap">
        <h3>{{$t('已绑定银行卡')}}<span>{{ `(${myBankCards.length}/${max})` }}</span>
        </h3>
        <BankCardList :max="4" :list="myBankCards" :isCenter="true"/>
      </div>
</template>

<script setup>
import { inject, computed } from 'vue';
import BankCardList from '@/components/BankCardList/index.vue';

const global = inject('global');

const $store = inject('store');

const { user } = $store.state;
const max = 4;

const myBankCards = computed(() => user?.userInfo?.user_bank ?? []);

</script>

<style lang="scss" scoped>
.bank-card-wrap {
  display: flex;
  flex-direction: column;
  min-height: 500px;

  h3 {
    font-size: 20px;
    font-weight: normal;
    color: var(--font-color-000);
    margin: 0 0 14px;
  }
}
</style>
