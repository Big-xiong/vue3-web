<template>
  <div class="bank-account">
    <el-image v-if="projectName" :src="`~@img/deposit/bank-account@2x.png`" />
    <el-image v-else :src="`~@img/deposit/bank-account@2x.png`" />
    <ul>
      <li>
        <label>{{ $t('银行卡号') }}</label>
        <span class="copy1 no-select">{{ data.bank_card_no }}</span>
        <a v-clipboard:copy="data.bank_card_no" v-clipboard:success="onCopy"
          v-clipboard:error="onError">{{ $t('复制') }}</a>
      </li>
      <li>
        <label>{{ $t('账户姓名') }}</label>
        <span class="copy1 no-select">{{ data.bank_account_name }}</span>
        <a v-clipboard:copy="data.bank_account_name" v-clipboard:success="onCopy"
          v-clipboard:error="onError">{{ $t('复制') }}</a>
      </li>
      <li>
        <label>{{ $t('开户银行') }}</label>
        <span>{{ data.bank_name }}</span>
      </li>
      <li>
        <label>{{ $t('开户支行') }}</label>
        <span class="copy1 no-select">{{ data.bank_branch_name }}</span>
        <a v-clipboard:copy="data.bank_branch_name" v-clipboard:success="onCopy"
          v-clipboard:error="onError">{{ $t('复制') }}</a>
      </li>
      <li v-if="payment && payment.id === 2">
        <label>{{ $t('存款备注') }}</label>
        <span class="copy1 no-select">{{ data.rand_num }}</span>
        <a v-clipboard:copy="data.rand_num" v-clipboard:success="onCopy" v-clipboard:error="onError">{{ $t('复制') }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');

defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  payment: {
    type: Object,
    default: () => ({}),
  },
});

const isKJJ = import.meta.env.VITE_APP_PROJECT_NAME === '10050';

function onCopy(e) {
  this.$notify({
    title: this.$t('成功'),
    message: this.$t('内容复制成功'),
    type: 'success',
  });
}

function onError(e) {
  this.$notify({
    title: this.$t('成功'),
    message: this.$t('内容复制失败'),
    type: 'error',
  });
}
</script>

<style lang="scss" scoped>
.bank-account {
  width: 405px;
  height: 220px;
  position: relative;

  ul {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 20px;

    li {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      label {
        width: 80px;
      }

      span {
        font-weight: 500;
        color: var(--font-color-fff);
      }

      a {
        line-height: 22px;
        border: 1px solid var(--border-color-fff);
        border-radius: 20px;
        color: var(--font-color-fff);
        font-size: 12px;
        padding: 0 10px;
        margin-left: 15px;
        transition: all 0.45s ease-out;
        // &:hover{
        //   border-color: var(--theme-color);
        //   color: var(--theme-color);
        // }
      }
    }
  }
}
</style>
