<template>
  <Dialog
    v-model="modelValue"
    center
    confirmType="primary"
    :confirmText="$t('确定')"
    :close-on-click-modal="false"
    :showCancelBtn="false"
    @close="setPassword"
    @onConfirm="setPassword"
    customeClass="tips-wrap"
    v-bind="$attrs"
    footerBtnWidth="200px"
    contentPadding="40px 40px 0"
  >
    <img
      src="@/assets/images/center/tipsIcon/error.png"
      alt
      class="tips-img"
    />
    <h2 class="tips-title">{{ msg.title }}</h2>
    <!-- <img
          :src="$getSrc(`/src/assets/images/center/tipsIcon/${icon}.png`)"
          class="tips-img"
          alt=""
      >-->
    <p class="dialog-tips">
      {{$t('当前已完成')}}
      <span v-money="done_flow"></span>
      {{ $t('有效投注，还差') }}
      <span v-money="undone_flow"></span>
      {{ $t('才能提款') }}
    </p>
  </Dialog>
</template>

<script setup>
import { inject } from 'vue';
import Dialog from './index.vue';

const global = inject('global');

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: 'error',
  },
  tips: {
    type: String,
    default: 'error',
  },
  msg: {
    type: Object,
    default: () => { },
  },
  done_flow: {
    type: String,
    default: '',
  },
  undone_flow: {
    type: String,
    default: '',
  },
});

function setPassword(close) {
  global.$router.push({ path: '/center/home' });
  close?.();
}

</script>

<style lang="scss" scoped>
.tips-img {
  display: block;
  width: 70px;
  margin: 0 auto;
}
.dialog-tips {
  padding: 0;

  :deep(span) {
    font-family: moneyFont;
  }
}
.tips-title {
  text-align: center;
  font-size: 20px;
  margin: 40px 0 10px;
  font-weight: 600;
  color: var(--font-color-f66);
}
</style>

<style lang="scss">
.tips-wrap {
  .el-dialog__footer {
    .dialog-footer-inline-btn {
      flex-direction: column;
      .el-button {
        margin-top: 20px;

        &--default {
          // color: var(--font-color-999);
          // border-color: var(--font-color-999);
        }
      }
    }
  }
}
</style>
