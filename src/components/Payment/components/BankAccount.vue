<template>
  <div class="bank-account">
    <!-- <el-image src="/src/assets/images/deposit/bank-account@2x.png" /> -->
    <ul>
      <li>
        <label>{{ $t('银行卡号') }}</label>
        <span class="copy1 no-select">{{ data.bank_card_no }}</span>
        <a
          v-clipboard:copy="data.bank_card_no"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          class="pointer"
        >
          <svg-icon name="copybtn" />
        </a>
      </li>
      <li>
        <label>{{ $t('账户姓名') }}</label>
        <span class="copy1 no-select">{{ data.bank_account_name }}</span>
        <a
          v-clipboard:copy="data.bank_account_name"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          class="pointer"
        >
          <svg-icon name="copybtn" />
        </a>
      </li>
      <li>
        <label>{{ $t('开户银行') }}</label>
        <span>{{ data.bank_name }}</span>
        <a style="border: none"></a>
      </li>
      <li>
        <label>{{ $t('开户支行') }}</label>
        <span class="copy1 no-select">{{ data.bank_branch_name }}</span>
        <a
          v-clipboard:copy="data.bank_branch_name"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          class="pointer"
        >
          <svg-icon name="copybtn" />
        </a>
      </li>
      <li v-if="payment && payment.id === 2">
        <label>{{ $t('存款备注') }}</label>
        <span class="copy1 no-select">{{ data.rand_num }}</span>
        <a
          v-clipboard:copy="data.rand_num"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          class="pointer"
        >
          <svg-icon name="copybtn" />
        </a>
      </li>
    </ul>
    <svg-icon name="withdraw-card" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import SvgIcon from '../../SvgIcon.vue';

export default defineComponent({
  name: 'BankAccount',
  components: { SvgIcon },
  props: ['data', 'payment'],
  methods: {
    onCopy(e) {
      this.$message({
        title: this.$t('成功'),
        message: this.$t('内容复制成功'),
        type: 'success',
      });
    },
    onError(e) {
      this.$message({
        title: this.$t('成功'),
        message: this.$t('内容复制失败'),
        type: 'error',
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.bank-account {
  width: 405px;
  height: 220px;
  position: relative;
  background-size: 100% auto;
  font-size: 14px;
  margin-right: 35px;
  background: var(--dark-bg-color-232323, var(--bg-color-f7f7f7));

  > .svg-icon {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    fill: var(--current-bank-color, var(--theme-color)) !important;
    z-index: 0;
    use {
      z-index: -1;
    }
  }

  ul {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 20px;
    z-index: 2;
    li {
      height: 36px;
      width: 330px;
      display: flex;
      align-items: center;
      label {
        white-space: nowrap;
        margin-right: 20px;
        color: var(--font-color-000);
        opacity: 0.4;
      }
      span {
        margin-right: 10px;
        padding-left: 5px;
        font-weight: 500;
        white-space: nowrap;
        color: var(--font-color-222930);
      }

      a {
        display: inline-block;
        width: 12px;
        height: 13px;
        > .svg-icon {
          width: 100%;
          height: 100%;
          fill: var(--theme-color) !important;
        }
      }
    }
  }
}
</style>
